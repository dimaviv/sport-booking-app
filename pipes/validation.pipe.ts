import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "../exceptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);
    console.log(errors)
    if (errors.length) {
      const messages = errors.map((err) => {
        console.log('err')
        console.log(err)
        return `${err.property} - ${Object.values(err.constraints).join(", ")}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}
