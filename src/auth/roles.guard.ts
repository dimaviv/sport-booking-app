import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import {Request} from "express";
import {ConfigService} from "@nestjs/config";



@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private jwtService: JwtService,
                private reflector: Reflector,
                private readonly configService: ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) || [];

            if (!requiredRoles){
                return true;
            }

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

            if (!token){
                throw new UnauthorizedException();
            }

            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
            }).catch(err => console.log(err))

            request['user'] = payload;

            return payload.roles.some(role => requiredRoles.includes(role));

        } catch (e){
            throw new HttpException( "No access", HttpStatus.FORBIDDEN)
        }

    }

    private extractTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.access_token;
    }

}
