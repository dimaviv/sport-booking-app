import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {MailModule} from "./mail/mail.module";
import {FilesModule} from "./files/files.module";
import {RolesModule} from "./roles/roles.module";
import {GoogleStrategy} from "./auth/strategies/google.stategy";

@Module({
  imports: [AuthModule, UserModule, MailModule, FilesModule, RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
          configService: ConfigService,
          // tokenService: TokenService,
      ) => {
        return {
          playground: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,

        }
      }

    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    ],
  controllers: [],
  providers: [GoogleStrategy],
})

export class AppModule {}
