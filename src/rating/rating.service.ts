import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import {CreateRatingInput} from './dto/create-rating.input';
import {UpdateRatingInput} from './dto/update-rating.input';
import {PrismaService} from "../prisma.service";
import {FacilityService} from "../facility/facility.service";
import {InternalException} from "../../exceptions/validation.exception";

@Injectable()
export class RatingService {
  constructor(
      private readonly prisma: PrismaService,
      @Inject(forwardRef(() => FacilityService))
      private readonly facilityService: FacilityService
  ) {}

  async create(createRatingInput: CreateRatingInput, userId) {
    try {
      if (await this.facilityService.isOwner(createRatingInput.facilityId, userId)){
        return new BadRequestException("User is the owner")
      }
      const existRate = await this.prisma.rating.findUnique({
        where: { userId_facilityId: { userId, facilityId: createRatingInput.facilityId } }
      });
      if (existRate){
        return new BadRequestException("The rate is already exists")
      }
      return await this.prisma.rating.create({data:{...createRatingInput, userId }})
    }catch (e) {
      throw new InternalException(e.message);
    }
  }

  async update(updateRatingInput: UpdateRatingInput, userId) {
    try {
      const updatedRate = await this.prisma.rating.update({
        where:{id:updateRatingInput.id, userId},
        data:{value: updateRatingInput.value }
      })

      if (await this.facilityService.isOwner(updatedRate.facilityId, userId)){
        return new BadRequestException("User is the owner")
      }

      return updatedRate
    }catch (e) {
      throw new InternalException(e.message);
    }
  }

  async remove(id: number, userId) {
    try {
      const rate = await this.prisma.rating.findUnique({where:{id, userId}})
      if (!rate) return  new BadRequestException('Incorrect id or it is not the users\'s rate')
      return await this.prisma.rating.delete({
        where:{id, userId},
      })
    }catch (e) {
      throw new InternalException(e.message);
    }
  }

  async getUserRate(facilityId, userId){
    try {
      return await this.prisma.rating.findFirst({where: {facilityId, userId}})
    }catch (e) {
      throw new InternalException(e.message);
    }
  }

  async aggregateRating(facilityId: number | null = null, userId: number | null = null) {
    const where: any = {};
    if (facilityId) {
      where.facilityId = facilityId;
    }

    try {
      const overallResults = await this.prisma.rating.groupBy({
        by: ['facilityId'],
        where,
        _count: {
          id: true,
        },
        _avg: {
          value: true,
        }
      });

      let userRatingsMap = new Map();
      if (userId) {
        const userRatings = await this.prisma.rating.findMany({
          where: {
            ...where,
            userId
          },
        });

        for (const rating of userRatings) {
          userRatingsMap.set(rating.facilityId, rating);
        }
      }

      return overallResults.map(result => ({
        facilityId: result.facilityId,
        ratingCount: result._count.id,
        avgRating: result._avg.value,
        currentUserRate: userRatingsMap.get(result.facilityId) || null
      }));
    } catch (e) {
      throw new InternalException(e.message);
    }
  }


}
