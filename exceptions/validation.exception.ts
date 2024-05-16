import {HttpException, HttpStatus} from "@nestjs/common";


export class ValidationException extends HttpException{
    messages;

    constructor(response) {
        super(response, HttpStatus.BAD_REQUEST);
        console.log(response)
        this.messages = response
    }
}

export class InternalException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
