import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingResolver } from './rating.resolver';
import {PrismaService} from "../prisma.service";
import {FacilityService} from "../facility/facility.service";
import {JwtService} from "@nestjs/jwt";
import {FilesService} from "../files/files.service";
import {FacilityModule} from "../facility/facility.module";


@Module({
  imports:[FacilityModule],
  providers: [RatingResolver, RatingService, PrismaService, FacilityService, JwtService, FilesService],
  exports: [RatingService],
})
export class RatingModule {}
