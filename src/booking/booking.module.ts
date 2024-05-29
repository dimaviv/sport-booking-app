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
import {RolesGuard} from "../auth/roles.guard";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {GraphqlAuthCheck} from "../auth/graphql-auth-check.guard";
import {UserModule} from "../user/user.module";

@Module({
  providers: [BookingResolver, BookingService, FacilityService, UserModule,
    PrismaService, RatingService, RolesService, FilesService, JwtService, ConfigService, RolesGuard, GraphqlAuthGuard, GraphqlAuthCheck]
})
export class BookingModule {}
