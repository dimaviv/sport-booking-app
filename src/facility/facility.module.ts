import {forwardRef, Module} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityResolver } from './facility.resolver';
import {PrismaService} from "../prisma.service";
import {UserService} from "../user/user.service";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {RatingService} from "../rating/rating.service";
import {FilesModule} from "../files/files.module";
import {RatingModule} from "../rating/rating.module";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {GraphqlAuthCheck} from "../auth/graphql-auth-check.guard";
import {RolesGuard} from "../auth/roles.guard";
import {AuthModule} from "../auth/auth.module";


@Module({
  providers: [
    FacilityResolver, FacilityService, PrismaService,
    UserService, FilesService, RolesService, ConfigService,
    JwtService, RolesGuard, GraphqlAuthGuard, GraphqlAuthCheck
  ],
  imports: [
    forwardRef(() => AuthModule),
    FilesModule,
    forwardRef(() => RatingModule),
  ],
  exports: [
    FacilityService,
  ],
})
export class FacilityModule {}
