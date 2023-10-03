import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import {PrismaService} from "../prisma.service";
import { RolesResolver } from './roles.resolver';
import {JwtService} from "@nestjs/jwt";





@Module({
  providers: [RolesService, PrismaService, RolesResolver, JwtService],
  imports: [],
  exports: [
      RolesService
  ]
})
export class RolesModule {}
