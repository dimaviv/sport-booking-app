import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityResolver } from './facility.resolver';
import {PrismaService} from "../prisma.service";
import {UserService} from "../user/user.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";

@Module({
  providers: [FacilityResolver, FacilityService, PrismaService, UserService, FilesService, RolesService, ConfigService, JwtService]
})
export class FacilityModule {}
