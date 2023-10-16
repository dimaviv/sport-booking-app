import {BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import {CreateFacilityInput} from './dto/create-facility.input';
import {UpdateFacilityInput} from './dto/update-facility.input';
import {PrismaService} from "../prisma.service";
import {InternalException, UnauthorizedException} from "../../exceptions/validation.exception";
import {RatingService} from "../rating/rating.service";
import { mergeFacilitiesWithRating} from '../utils/arrayMerger'


@Injectable()
export class FacilityService {
  constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => RatingService))
      private readonly ratingService: RatingService,
  ) {}

  async create(createFacilityInput: CreateFacilityInput, userId: number) {
    try {
      return await this.prisma.facility.create({
        data: {
          ...createFacilityInput,
          ownerId:userId
        }})
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async update(id: number, updateFacilityInput: UpdateFacilityInput, userId: number) {
    try {

      if (!await this.isOwner(id, userId)){
        return new BadRequestException("User isn't the owner")
      }

      return await this.prisma.facility.update({
        where:{id},
        data: {
          ...updateFacilityInput
        }});
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async findAll(filters, pagination, userId) {
    try {
      const { sortBy, sportType, coveringType, facilityType, district, ownerId } = filters;
      let { page, limit } = pagination;

      const where = {
        ...(sportType && { sportType }),
        ...(coveringType && { coveringType }),
        ...(facilityType && { facilityType }),
        ...(district && { district }),
        ...(ownerId && { ownerId }),
      };

      const [facilities, totalCount] = await this.prisma.$transaction([
        this.prisma.facility.findMany({
          where,
          include: {
            images: {
              take: 1
            },
            _count: {
              select: { ratings: true },
            },
          },
          orderBy:{
            ratings: {
              _count: 'desc'
            }
          },
          skip: page * limit - limit,
          take: limit,
        }),
        this.prisma.facility.count({ where }),
      ]);

      const aggregateRating = await this.ratingService.aggregateRating()

      const facilitiesWithRating = await mergeFacilitiesWithRating(facilities, aggregateRating);

      return {totalCount, facilities: facilitiesWithRating}
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const facility = await this.prisma.facility.findUnique({
        where:{id},
        include: {
          images: true,
          _count: {
            select: { ratings: true },
          },
        },
      });
      const aggregateRating = await this.ratingService.aggregateRating(facility.id);
      let userRate = null
      if (userId) userRate = await this.ratingService.getUserRate(facility.id, userId)

      return  {
        ...facility,
        ratingCount: aggregateRating[0]?._count?.id || 0,
        avgRating: aggregateRating[0]?._avg?.value || 0,
        currentUserRate: userRate,
      }
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async remove(id: number, userId) {
    try {
      const facility = await this.prisma.facility.findUnique({where:{id}, select: {id:true, ownerId: true}})
      if (userId !== facility.ownerId) return  new UnauthorizedException("User is not the owner")

      return await this.prisma.facility.delete({
        where: {id},
      })
    } catch (e) {
      throw new InternalException(e.message);
    }
  }

  async isOwner(facilityId, userId){
    const facility = await this.prisma.facility.findUnique({where:{id:facilityId}})
    return facility.ownerId === userId
  }

}
