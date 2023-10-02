import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import {MailService} from "../mail/mail.service";
import {FilesService} from "../files/files.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";
import {RolesService} from "../roles/roles.service";

@Module({
  providers: [AuthResolver, AuthService, MailService, FilesService, UserService, JwtService, PrismaService, RolesService]
})
export class AuthModule {}
