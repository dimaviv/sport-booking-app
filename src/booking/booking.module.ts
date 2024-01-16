import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import {FacilityService} from "../facility/facility.service";
import {UserService} from "../user/user.service";
import {PrismaService} from "../prisma.service";
import {RatingService} from "../rating/rating.service";
import {RolesService} from "../roles/roles.service";
import {FilesService} from "../files/files.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Module({
  providers: [BookingResolver, BookingService, FacilityService, UserService,
    PrismaService, RatingService, RolesService, FilesService, JwtService, ConfigService]
})
export class BookingModule {}
