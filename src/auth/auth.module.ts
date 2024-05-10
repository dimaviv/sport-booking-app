import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import {MailService} from "../mail/mail.service";
import {FilesService} from "../files/files.service";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";
import {RolesService} from "../roles/roles.service";
import {FacebookStrategy} from "./strategies/facebook.stategy";
import {GoogleStrategy} from "./strategies/google.stategy";
import {AuthController} from "./auth.controller";
import {RatingModule} from "../rating/rating.module";

@Module({
  providers: [AuthResolver, AuthService, MailService, FilesService, UserService,
    JwtService, PrismaService, RolesService, GoogleStrategy, FacebookStrategy],
  controllers: [AuthController],
  imports: [
    RatingModule,
  ],

})
export class AuthModule {}
