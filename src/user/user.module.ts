import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";

@Module({
  providers: [UserService, UserResolver, JwtService, PrismaService, FilesService, RolesService]
})
export class UserModule {}
