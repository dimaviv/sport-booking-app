import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationResolver } from './location.resolver';
import {PrismaService} from "../prisma.service";

import {ConfigService} from "@nestjs/config";


@Module({
  providers: [LocationResolver, LocationService, PrismaService, ConfigService]
})
export class LocationModule {}
