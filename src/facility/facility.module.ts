import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityResolver } from './facility.resolver';
import {PrismaService} from "../prisma.service";
import {UserService} from "../user/user.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {RatingService} from "../rating/rating.service";


@Module({
  providers: [FacilityResolver, FacilityService, PrismaService,
    UserService, FilesService, RolesService, ConfigService,
    JwtService, RatingService],

})
export class FacilityModule {}
