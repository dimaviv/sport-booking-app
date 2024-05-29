import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {RatingService} from "../rating/rating.service";
import {FacilityModule} from "../facility/facility.module";
import {UserController} from "./user.controller";
import {MailModule} from "../mail/mail.module";
import {MailService} from "../mail/mail.service";


@Module({
  providers: [UserService, UserResolver, JwtService, PrismaService, FilesService, RolesService, RatingService, MailService],
  controllers: [UserController],
  imports: [
    MailModule,
    FacilityModule,

  ],
})
export class UserModule {}

