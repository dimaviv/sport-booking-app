import {BadRequestException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
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
import { Prisma } from '@prisma/client';


@Injectable()
export class FacilityService {
  constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => RatingService))
      private readonly ratingService: RatingService,
      private readonly fileService: FilesService,
  ) {}


  async removeFacilityPhotos(photoIds: number[], userId: number): Promise<boolean> {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const images = await prisma.image.findMany({
          where: {
            id: {
              in: photoIds,
            },
          },
        });

        if (images.length !== photoIds.length) {
          throw new NotFoundException("Some images not found");
        }

        const facilityIds = images.map(image => image.facilityId);

        for (const facilityId of facilityIds) {
          if (!await this.isOwner(facilityId, userId)) {
            throw new BadRequestException("User isn't the owner of facility with id " + facilityId);
          }
        }

        const deletedImages = await prisma.image.deleteMany({
          where: {
            id: {
              in: photoIds,
            },
          },
        });

        for (const image of images) {
          await this.fileService.deleteFile(image.image);
        }

        return !!deletedImages.count;
      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async updateTimeSlots(updateTimeSlotsInput: UpdateTimeSlotsInput, userId: number) {
    try {
      let { timeSlotIds, ...slotsData } = updateTimeSlotsInput;

      return await this.prisma.$transaction(async (prisma) => {

        const slots = await prisma.timeSlot.findMany({
          where: {
            id: { in: timeSlotIds },
          },
          select: {
            id: true,
            facilityId: true
          }
        });

        if (slots.length === 0) {
          throw new NotFoundException('No time slots found with the provided IDs.');
        }

        const uniqueFacilityIds = new Set(slots.map(slot => slot.facilityId));
        if (uniqueFacilityIds.size > 1) {
          throw new BadRequestException('Time slots must belong to the same facility.');
        }

        const facilityId = slots[0].facilityId;

        if (!await this.isOwner(facilityId, userId)) {
          throw new BadRequestException("User isn't the owner of the facility.");
        }

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

  async deleteSchedule(facilityId: number, userId: number): Promise<boolean> {
    if (!await this.isOwner(facilityId, userId)){
      throw new BadRequestException("User is not the owner of the facility");
    }
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const timeSlotsWithBookings = await prisma.timeSlot.findMany({
          where: {
            facilityId: facilityId,
            isActive: true,
            bookingSlots: {
              some: {}
            }
          }
        });
        if (timeSlotsWithBookings.length > 0) {
          await prisma.timeSlot.updateMany({
            where: {
              id: {
                in: timeSlotsWithBookings.map(slot => slot.id)
              }
            },
            data: {
              isActive: false
            }
          });
        }
        await prisma.facility.update({
          where: {
            id: facilityId
          },
          data: {
            avgPrice: null
          }
        });
        const deleteResult = await prisma.timeSlot.deleteMany({
          where: {
            facilityId: facilityId,
            isActive: true,
            bookingSlots: {
              none: {}
            }
          }
        });

        return deleteResult.count > 0 || timeSlotsWithBookings.length > 0;
      });
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async createSchedule(createScheduleInput: CreateScheduleInput, userId: number) {
    const { facilityId, daysOfWeek, price, startTime, endTime, minBookingTime } = createScheduleInput;

    if (!await this.isOwner(facilityId, userId)){
      throw new BadRequestException("User isn't the owner");
    }

    try {
      const slots = this.generateTimeSlots(startTime, endTime, daysOfWeek);

      return await this.prisma.$transaction(async (prisma) => {
        if (minBookingTime){
          await prisma.facility.update({where: {id: facilityId}, data:{minBookingTime}})
        }
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
          },
          include:{
            owner: {include: {userOwner: true}},
            district: {
              include:{
                city: {
                  include:{
                    districts: true
                  }
                },
              }
            },
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
          },
          include:{
            owner: {include: {userOwner: true}},
            district: {
              include:{
                city: {
                  include:{
                    districts: true
                  }
                },
              }
            },
          }
        });

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
      if (!filters) filters = {};

      const { sortBy, sportType, coveringType, facilityType, districts, ownerId, cityId, search, minPrice, maxPrice } = filters;
      let { page, limit } = pagination;

      let searchIds;
      if (search) searchIds = await this.fullTextSearch(search)

      const where = {
        ...(coveringType && { coveringType: { in: coveringType } }),
        ...(facilityType && { facilityType }),
        ...(ownerId && { ownerId }),
        ...(sportType && { sportType: { hasSome: sportType } }),
        ...(districts && { districtId: { in: districts } }),
        ...(cityId && { district: { cityId } }),
        ...(!(minPrice !== undefined || maxPrice !== undefined) && { avgPrice: { not: null } }),
        ...(minPrice !== undefined || maxPrice !== undefined) && {
          avgPrice: {
            gte: minPrice || 0,
            lte: maxPrice || 999999999,
            not: null
          }  },
        ...(searchIds && { id:{in:searchIds} }),
        isRemoved: false,
      };

      let orderBy = [];

      if (sortBy === 'price_asc') orderBy.push({ avgPrice: 'asc' });
      else if(sortBy === 'price_desc') orderBy.push({ avgPrice: 'desc' });
      else  orderBy.push({ ratings: { _count: 'desc' } });

      const [facilities, totalCount, priceRangeAggr] = await this.prisma.$transaction([
        this.prisma.facility.findMany({
          where: {
            ...where,
          },
          include: {
            owner: {include: {userOwner: true}},
            district: {
              include: {
                city: true
              }
            },
            images: {
              where: { isMain: true }
            },
            _count: {
              select: { ratings: true },
            },
          },
          orderBy: [
            { isWorking: 'desc' },
            ...orderBy
          ],
          skip: page * limit - limit,
          take: limit,
        }),
        this.prisma.facility.count({
          where: {
            ...where,
          }
        }),
        this.prisma.facility.aggregate({

          _min: {
            avgPrice: true,
          },
          _max: {
            avgPrice: true,
          }
        }),
      ]);

      const userFavorites = userId ? await this.prisma.favorite.findMany({
        where: {
          userId: userId,
          facilityId: { in: facilities.map(f => f.id) },
        },
      }) : [];

      const favoritesMap = userFavorites.reduce((map, fav) => {
        map[fav.facilityId] = true;
        return map;
      }, {});

      const facilitiesWithFavorites = facilities.map(facility => ({
        ...facility,
        currentUserIsFavorite: !!favoritesMap[facility.id],
      }));

      const aggregateRating = await this.ratingService.aggregateRating(null, userId);

      const facilitiesWithRatingAndFavorites = await mergeFacilitiesWithRating(facilitiesWithFavorites, aggregateRating);

      const priceRange = {min: priceRangeAggr._min.avgPrice, max: priceRangeAggr._max.avgPrice}
      return { totalCount, priceRange, facilities: facilitiesWithRatingAndFavorites };
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async findOwnerFacilities(pagination, userId) {
    try {
      let { page, limit } = pagination;

      const where = {ownerId: userId, isRemoved: false}

      const [facilities, totalCount, priceRangeAggr] = await this.prisma.$transaction([
        this.prisma.facility.findMany({
          where: {
            ...where,
          },
          include: {
            owner: {include: {userOwner: true}},
            district: {
              include: {
                city: true
              }
            },
            images: {
              where: { isMain: true }
            },
            _count: {
              select: { ratings: true },
            },
          },
          orderBy: [
            { isWorking: 'desc' },
          ],
          skip: page * limit - limit,
          take: limit,
        }),
        this.prisma.facility.count({
          where: {
            ...where,
          }
        }),
        this.prisma.facility.aggregate({
          where: {
            ...where,
          },
          _min: {
            avgPrice: true,
          },
          _max: {
            avgPrice: true,
          }
        }),
      ]);

      const userFavorites = userId ? await this.prisma.favorite.findMany({
        where: {
          userId: userId,
          facilityId: { in: facilities.map(f => f.id) },
        },
      }) : [];

      const favoritesMap = userFavorites.reduce((map, fav) => {
        map[fav.facilityId] = true;
        return map;
      }, {});

      const facilitiesWithFavorites = facilities.map(facility => ({
        ...facility,
        currentUserIsFavorite: !!favoritesMap[facility.id],
      }));

      const aggregateRating = await this.ratingService.aggregateRating();
      const facilitiesWithRatingAndFavorites = await mergeFacilitiesWithRating(facilitiesWithFavorites, aggregateRating);

      const priceRange = {min: priceRangeAggr._min.avgPrice, max: priceRangeAggr._max.avgPrice}
      return { totalCount, priceRange, facilities: facilitiesWithRatingAndFavorites };
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async fullTextSearch(search){
    const searchInput = search.split(' ').join(' | ');

    const rawFacilities: any = await this.prisma.$queryRaw`
        SELECT id, ts_rank_cd(search_vector, query) AS rank
        FROM "Facility", to_tsquery('russian', ${searchInput}) query
        WHERE search_vector @@ query
        ORDER BY rank DESC`;

    const facilityOrder = new Map(rawFacilities.map((f, index) => [f.id, index]));
    const facilityIds: any = Array.from(facilityOrder.keys());

    return facilityIds;
  }

  async calcTimeSlotStatus(timeSlotsWithDates: any[], facilityId: number) {
    // Prepare the list of dates for comparison
    const dates = timeSlotsWithDates.map(slot => {
      const date = new Date(slot.date);
      return date.toISOString().split('T')[0]; // Get the date part as a string
    });

    // Construct the SQL query safely using Prisma.sql
    const dateConditions = dates.map(date => Prisma.sql`CAST("date" AS DATE) = CAST(${date} AS DATE)`);

    // Perform the raw query safely using parameterized queries
    const query = Prisma.sql`
    SELECT "timeSlotId", "date"
    FROM "BookingSlot"
    WHERE "timeSlotId" IN (
      SELECT "id"
      FROM "TimeSlot"
      WHERE "facilityId" = ${facilityId}
    )
    AND (${Prisma.join(dateConditions, ' OR ')})
  `;

    // Use parameterized queries to avoid SQL injection
    const bookingSlots: Array<{ timeSlotId: number, date: Date }> = await this.prisma.$queryRaw(query);

    // Create a map to quickly lookup booked time slots
    const bookedTimeSlots = new Map();
    for (const bookingSlot of bookingSlots) {
      bookedTimeSlots.set(`${bookingSlot.timeSlotId}_${bookingSlot.date.toISOString().split('T')[0]}`, true);
    }

    // Update the status of timeSlotsWithDates based on bookingSlots
    await Promise.all(timeSlotsWithDates.map(async slot => {
      const dateKey = slot.date.toISOString().split('T')[0];
      const isBooked = bookedTimeSlots.has(`${slot.id}_${dateKey}`);
      if (isBooked) {
        slot.status = 'booked';
      }
    }));

    return timeSlotsWithDates;
  }

  async findOne(id: number, userId: number = 0) {
    try {
      const [facility, isFavorite, uniqueDaysOfWeek, userHasAttended] = await this.prisma.$transaction([
        this.prisma.facility.findUnique({
          where: { id },
          include: {
            owner: { include: { userOwner: true } },
            images: true,
            district: {
              include: {
                city: {
                  include: {
                    districts: true,
                  },
                },
              },
            },
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
        }),
        this.prisma.timeSlot.findMany({
          where: { facilityId: id },
          distinct: ['dayOfWeek'],
          select: {
            dayOfWeek: true,
          },
        }),
        this.prisma.booking.findFirst({
          where: {
            userId: userId,
            facilityId: id,
            status: 'completed',
          },
          select: { id: true },
        }),
      ]);

      if (!facility) return new BadRequestException('Facility with such id was not found');
      if (facility.isRemoved) return new BadRequestException('Facility is removed');

      if (!facility.avgPrice && facility.ownerId !== userId)
        return new BadRequestException('Only facility owner can see the facility without schedule');

      let groupedTimeSlots;
      if (facility.timeSlots.length > 0) {
        const { timeSlotsWithDates, bookingDates } = await this.calcTimeSlotDate(facility.timeSlots, uniqueDaysOfWeek);
        const timeSlotsWithStatus = await this.calcTimeSlotStatus(timeSlotsWithDates, id);
        groupedTimeSlots = await this.groupTimeSlotsByDateAndDayOfWeek(timeSlotsWithStatus);
      }

      const aggregateRating = await this.ratingService.aggregateRating(id);

      let userRate = null;
      if (userId) userRate = await this.ratingService.getUserRate(id, userId);

      return {
        ...facility,
        ratingCount: aggregateRating[0]?.ratingCount || 0,
        avgRating: aggregateRating[0]?.avgRating || 0,
        currentUserRate: userRate,
        currentUserIsFavorite: !!isFavorite,
        schedule: groupedTimeSlots,
        userHasAttended: !!userHasAttended,
      };
    } catch (e) {
      throw new InternalException(e.message);
    }
  }


  async groupTimeSlotsByDateAndDayOfWeek(timeSlots) {
    // Use a Map as the accumulator
    const groups = timeSlots.reduce((acc, slot) => {
      // Construct a key from the date and dayOfWeek
      const key = `${slot.date}-${slot.dayOfWeek}`;

      // Initialize the group if it doesn't already exist
      if (!acc.has(key)) {
        acc.set(key, {
          date: slot.date,
          dayOfWeek: slot.dayOfWeek,
          timeSlots: []
        });
      }

      // Push the current slot into the correct group
      acc.get(key).timeSlots.push(slot);

      return acc;
    }, new Map());

    // Convert the Map to an array of its values
    return Array.from(groups.values());
  }

  async calcTimeSlotDate(timeSlots, uniqueDaysOfWeek) {
    const bookingDays = uniqueDaysOfWeek.map(slot => slot.dayOfWeek);

    const bookingDates = await this.getBookingDates(bookingDays, new Date());

    const dateSlotsMap = new Map();


    for (const date of bookingDates) {
      const dayOfWeek = date.getDay();
      if (bookingDays.includes(dayOfWeek)) {
        dateSlotsMap.set(dayOfWeek, date);
      }
    }

    const timeSlotsWithDates = [];
    for (const slot of timeSlots) {
      const bookingDate = dateSlotsMap.get(slot.dayOfWeek) || null; // If no date matches, return null
      timeSlotsWithDates.push({
        ...slot,
        date: bookingDate
      });
    }

    return {timeSlotsWithDates, bookingDates};
  }

  async remove(id: number, userId) {
    try {
      const facility = await this.prisma.facility.findUnique({where:{id}, select: {id:true, ownerId: true}})
      if (userId !== facility.ownerId) return new UnauthorizedException("User is not the owner")

      return await this.prisma.facility.update({
        where: {id},
        data:{isRemoved: true}
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

  async getBookingDates(bookingDays, currentDate) {
    const bookingDates = [];

    bookingDays.forEach(dayOfWeek => {
      const currentDay = currentDate.getDay();
      let dayDiff = dayOfWeek - currentDay;

      // Adjust for days in the past to push to the next week
      if (dayDiff < 0) {
        dayDiff += 7;
      }

      // Calculate the booking date
      const bookingDate = new Date(currentDate);
      bookingDate.setDate(currentDate.getDate() + dayDiff);
      bookingDates.push(bookingDate);
    });

    return bookingDates;
  }

}
