import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";


@Injectable()
export class LocationService {

  constructor(private prisma: PrismaService) {}


  async findAllCities() {
    return this.prisma.city.findMany({
      include: {
        districts: true
      }
    });
  }

  async findAllDistricts(cityId: number) {
    return await this.prisma.district.findMany({
      where: { cityId: cityId },
        include: {
          city: true,
        }
      });
  }
}

