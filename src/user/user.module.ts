import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma.service";

@Module({
  providers: [UserService, UserResolver, JwtService, PrismaService]
})
export class UserModule {}
