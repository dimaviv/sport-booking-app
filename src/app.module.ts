import {forwardRef, HttpException, Module} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import * as path from "path";
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {MailModule} from "./mail/mail.module";
import {FilesModule} from "./files/files.module";
import {RolesModule} from "./roles/roles.module";
import {GoogleStrategy} from "./auth/strategies/google.stategy";
import { FacilityModule } from './facility/facility.module';
import { RatingModule } from './rating/rating.module';
import { BookingModule } from './booking/booking.module';
import {GraphQLError} from "graphql/index";


interface CustomError extends Error {
  statusCode?: number;
  error?: string;
}

@Module({
  imports: [AuthModule, UserModule, MailModule, FilesModule, RolesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
          configService: ConfigService,
          // tokenService: TokenService,
      ) => {
        return {
          formatError: (error: GraphQLError) => {
            const originalError = error.extensions?.originalError as CustomError;
            if (!originalError) {
              return {
                message: error.message,
                status: error.extensions?.code,
              };
            }
            return {
              error: originalError.error,
              message: originalError.message,
              status: error.extensions?.code,
              statusCode: originalError.statusCode,
            };
          },

          playground: true,
          autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,

        }
      }

    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    //forwardRef(() => FacilityModule),
    FacilityModule,
    RatingModule,
    BookingModule,
    ],
  controllers: [],
  providers: [GoogleStrategy],
})

export class AppModule {}
