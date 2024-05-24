import {InputType, Int, Field, Float} from '@nestjs/graphql';
import {IsInt, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

@InputType()
export class CreateScheduleInput {

    @IsInt()
    @Field()
    readonly facilityId?: number;

    @IsNotEmpty()
    @IsNumber({},{each: true})
    @Field(() => [Int])
    readonly daysOfWeek?: number[];

    @IsNumber()
    @Field()
    readonly price?: number;

    @IsString()
    @Field()
    readonly startTime?: string;

    @IsString()
    @Field()
    readonly endTime?: string;

    @IsOptional()
    @IsNumber()
    @Field({nullable: true})
    readonly minBookingTime?: number;

}
