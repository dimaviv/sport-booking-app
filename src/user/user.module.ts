import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {RatingService} from "../rating/rating.service";
import {RatingModule} from "../rating/rating.module";
import {FacilityModule} from "../facility/facility.module";
import {UserController} from "./user.controller";


@Module({
  providers: [UserService, UserResolver, JwtService, PrismaService, FilesService, RolesService, RatingService, RatingModule],
  controllers: [UserController],
  imports: [
    RatingModule,
    FacilityModule,
  ],
})

export class UserModule {}
