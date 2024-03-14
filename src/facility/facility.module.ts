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


@Module({
  providers: [
    FacilityResolver, FacilityService, PrismaService,
    UserService, FilesService, RolesService, ConfigService,
    JwtService,
    // RatingService should not be directly provided here if it's part of RatingModule
  ],
  imports: [
    FilesModule, // Assuming FilesService is exported by FilesModule
    forwardRef(() => RatingModule),
    //RatingModule, // Ensures RatingService is available if needed
    // Any other necessary module imports
  ],
  exports: [
    FacilityService,
    // Any other services you want to make available outside this module
  ],
})
export class FacilityModule {}
