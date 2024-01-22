import {
    CanActivate, ExecutionContext, Injectable, UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {Request} from "express";


@Injectable()
export class GraphqlAuthCheck implements CanActivate{
    constructor(
       private jwtService: JwtService,
       private configService: ConfigService,
    ) {}

    async canActivate(context:ExecutionContext): Promise<boolean>{
        const gqlCtx = context.getArgByIndex(2);
        const request: Request = gqlCtx.req;
        let token;

        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.slice(7);
        }

        if (!token) {
            token = this.extractTokenFromCookie(request);
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
            });

            request['user'] = payload;
        }catch (err){

            return true;
        }
        return true;
    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.access_token;
    }

}
