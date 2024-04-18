import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateFacilityInput} from './dto/create-facility.input';
import {UpdateFacilityInput} from './dto/update-facility.input';
import {PrismaService} from "../prisma.service";
import {InternalException, UnauthorizedException} from "../../exceptions/validation.exception";
import {RatingService} from "../rating/rating.service";
import {mergeFacilitiesWithRating} from '../utils/arrayMerger'
import {FilesService} from "../files/files.service";
import {Image} from "./facility.types";
import {CreateScheduleInput} from "./dto/create-schedule.input";
import {UpdateTimeSlotsInput} from "./dto/update-time-slots.input";
import { Prisma } from '@prisma/client'



@Injectable()
export class FacilityService {
  constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => RatingService))
      private readonly ratingService: RatingService,
      private readonly fileService: FilesService,
  ) {}


  async updateTimeSlots(updateTimeSlotsInput: UpdateTimeSlotsInput, userId: number) {
    try {
      let { timeSlotIds, ...slotsData } = updateTimeSlotsInput;

      return await this.prisma.$transaction(async (prisma) => {
        await prisma.timeSlot.updateMany({
          where: {
            id: {
              in: timeSlotIds
            }
          },
          data: slotsData
        });

        return prisma.timeSlot.findMany({
          where: {
            id: { in: timeSlotIds }
          },
          orderBy: [
            {
              dayOfWeek: 'asc',
            },
            {
              startTime: 'asc',
            },
          ],
        });
      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }


  async createSchedule(createScheduleInput: CreateScheduleInput, userId: number) {
    const { facilityId, daysOfWeek, price, startTime, endTime } = createScheduleInput;

    if (!await this.isOwner(facilityId, userId)){
      throw new BadRequestException("User isn't the owner");
    }

    try {
      const slots = this.generateTimeSlots(startTime, endTime, daysOfWeek);

      return await this.prisma.$transaction(async (prisma) => {
        await prisma.timeSlot.deleteMany({
          where: {
            facilityId: facilityId,
            bookingSlots: {
              none: {}
            }
          },
        });
        await prisma.timeSlot.updateMany({
          where: {
            facilityId: facilityId,
            bookingSlots: {
              some: {}
            }
          },
          data: {
            isActive: false
          }
        });
        await prisma.timeSlot.createMany({
          data: slots.map(slot => ({
            facilityId,
            price,
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.start,
            endTime: slot.end,
          })),
        });

        return prisma.timeSlot.findMany({
          where: {
            facilityId: facilityId,
            isActive: true,
          },
          orderBy: [{dayOfWeek: 'asc',}, {startTime: 'asc',},],
        });

      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }


  private generateTimeSlots(startTime: string, endTime: string, daysOfWeek: number[]) {

    const slots = [];

    daysOfWeek.forEach(dayOfWeek => {
      const start = new Date(`1970-01-01T${startTime}:00.000Z`);
      const end = new Date(`1970-01-01T${endTime}:00.000Z`);

      while (start < end) {
        const slotEnd = new Date(start.getTime() + 30 * 60000); // Add 30 minutes
        slots.push({ dayOfWeek, start: new Date(start), end: slotEnd });

        start.setTime(slotEnd.getTime());
      }
    });

    return slots;
  }

  async uploadFacilityPhotos(facilityId: number, userId: number, imageFiles: any[]): Promise<Image[]> {
    if (!await this.isOwner(facilityId, userId)){
      throw new BadRequestException("User isn't the owner")
    }
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const imageNames = await this.fileService.uploadMultipleFiles(imageFiles);
        return await Promise.all(imageNames.map(imageName => {
          return prisma.image.create({
            data: {
              image: imageName,
              facilityId: facilityId,
            }
          });
        }));

      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async create(createFacilityInput: CreateFacilityInput, userId: number, photoFile: any = null) {
    try {
      let photoName;
      if (photoFile) {
         photoName = await this.fileService.uploadFile(photoFile)
      }

      return await this.prisma.$transaction(async (prisma) => {
        const facility = await prisma.facility.create({
          data: {
            ...createFacilityInput,
            ownerId: userId
          }
        });

        if (photoName) {
          const photo = await prisma.image.create({
            data: {
              image: photoName,
              facilityId: facility.id,
              isMain: true
            }
          });
          return {facility, photo};
        }
        return {facility};
      });


    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async update(id: number, updateFacilityInput: UpdateFacilityInput, userId: number, photoFile: any = null) {
    try {

      if (!await this.isOwner(id, userId)){
        return new BadRequestException("User isn't the owner")
      }

      let photoName;
      if (photoFile) photoName = await this.fileService.uploadFile(photoFile)

      return await this.prisma.$transaction(async (prisma) => {
        const updatedFacility = await this.prisma.facility.update({
          where:{id},
          data: {
            ...updateFacilityInput
          }});

        if (photoName) {
          await prisma.image.deleteMany({
            where:{
              facilityId: updatedFacility.id,
              isMain: true
            }
          })
          const photo = await prisma.image.create({
            data: {
              image: photoName,
              facilityId: updatedFacility.id,
              isMain: true
            }
          });
          return {facility: updatedFacility, photo}
        }
        return {facility: updatedFacility}
      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async findAll(filters, pagination, userId) {
    try {
      const { sortBy, sportType, coveringType, facilityType, districts, ownerId, cityId, search } = filters;
      let { page, limit } = pagination;

      if (search) {
       return this.fullTextSearchAll(filters, pagination, userId)
      }

      const where = {
        ...(coveringType && { coveringType: { in: coveringType } }),
        ...(facilityType && { facilityType }),
        ...(ownerId && { ownerId }),
        ...(sportType && { sportType: { hasSome: sportType } }),
        ...(districts && { districtId: { in: districts } }),
        ...(cityId && { district: { cityId } }),
      };

      const [facilities, totalCount] = await this.prisma.$transaction([
        this.prisma.facility.findMany({
          where,
          include: {
            district:{
              include:{
                city:true
              }
            },
            images: {
              where: { isMain: true }
            },
            _count: {
              select: { ratings: true },
            },
          },
          orderBy: {
            ratings: {
              _count: 'desc'
            }
          },
          skip: page * limit - limit,
          take: limit,
        }),
        this.prisma.facility.count({ where }),
      ]);

      const userFavorites = userId ? await this.prisma.favorite.findMany({
        where: {
          userId: userId,
          facilityId: { in: facilities.map(f => f.id) },
        },
      }) : [];

      // Map of facilityId to favorite status
      const favoritesMap = userFavorites.reduce((map, fav) => {
        map[fav.facilityId] = true;
        return map;
      }, {});

      // Include the currentUserIsFavorite in each facility object
      const facilitiesWithFavorites = facilities.map(facility => ({
        ...facility,
        currentUserIsFavorite: !!favoritesMap[facility.id], // Convert to boolean; true if facilityId is in favoritesMap, false otherwise
      }));


      const aggregateRating = await this.ratingService.aggregateRating();
      const facilitiesWithRatingAndFavorites = await mergeFacilitiesWithRating(facilitiesWithFavorites, aggregateRating);

      return { totalCount, facilities: facilitiesWithRatingAndFavorites };
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async fullTextSearchAll(filters, pagination, userId){
    const { search, cityId } = filters;
    let { page, limit } = pagination;
    const offset = page * limit - limit;

    const searchInput = search.split(' ').join(' | ');

    const rawFacilities: any = await this.prisma.$queryRaw`
        SELECT id, ts_rank_cd(search_vector, query) AS rank
        FROM "Facility", to_tsquery('russian', ${searchInput}) query
        WHERE search_vector @@ query
        ORDER BY rank DESC
        LIMIT ${limit} OFFSET ${offset}`;

    const facilityOrder = new Map(rawFacilities.map((f, index) => [f.id, index]));
    const facilityIds: any = Array.from(facilityOrder.keys());

    const where = {
      ...(cityId && { district: { cityId } }),
      ...(facilityIds && { id:{in:facilityIds} }),
    };


    const [facilities, totalCount] = await this.prisma.$transaction([
     this.prisma.facility.findMany({
        where,
        include: {
          district:{
            include:{
              city:true
            }
          },
          images: {
            where: { isMain: true }
          },
          _count: {
            select: { ratings: true },
          },
        },
      }),
      this.prisma.facility.count({ where }),
    ]);

    // @ts-ignore
    facilities.sort((a, b) => facilityOrder.get(a.id) - facilityOrder.get(b.id));

    // Fetch user favorites for these facilities if a userId is provided
    let userFavorites = [];
    if (userId) {
      userFavorites = await this.prisma.favorite.findMany({
        where: {
          userId: userId,
          facilityId: { in: facilityIds },
        },
      });
    }

    const favoriteSet = new Set(userFavorites.map(fav => fav.facilityId));

    const facilitiesWithFavorites = facilities.map(facility => ({
      ...facility,
      currentUserIsFavorite: favoriteSet.has(facility.id),
    }));

    const aggregateRating = await this.ratingService.aggregateRating();
    const facilitiesWithRatingAndFavorites = await mergeFacilitiesWithRating(facilitiesWithFavorites, aggregateRating);

    return {totalCount: Number(totalCount), facilities: facilitiesWithRatingAndFavorites};
  }

  async findOne(id: number, userId: number = 0) {
    try {
      const [facility, isFavorite] = await this.prisma.$transaction([
        this.prisma.facility.findUnique({
          where: { id },
          include: {
            images: true,
            timeSlots: {
              where: {
                isActive: true,
              },
              orderBy: [
                {
                  dayOfWeek: 'asc',
                },
                {
                  startTime: 'asc',
                },
              ],
            },
            _count: {
              select: { ratings: true },
            },
          },
        }),
        this.prisma.favorite.findFirst({
          where: {
            userId: userId,
            facilityId: id,
          },
        })
      ]);

      const aggregateRating = await this.ratingService.aggregateRating(id);
      let userRate = null;
      if (userId) userRate = await this.ratingService.getUserRate(id, userId);

      return {
        ...facility,
        ratingCount: aggregateRating[0]?._count?.id || 0,
        avgRating: aggregateRating[0]?._avg?.value || 0,
        currentUserRate: userRate,
        currentUserIsFavorite: !!isFavorite,
      };
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async remove(id: number, userId) {
    try {
      const facility = await this.prisma.facility.findUnique({where:{id}, select: {id:true, ownerId: true}})
      if (userId !== facility.ownerId) return new UnauthorizedException("User is not the owner")

      return await this.prisma.facility.delete({
        where: {id},
      })
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async isOwner(facilityId, userId){
    const facility = await this.prisma.facility.findUnique({where:{id:facilityId}})
    if(!facility) throw Error('Facility not found')
    return facility.ownerId === userId
  }

}
