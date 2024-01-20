import {Field, Float, InputType, Int, registerEnumType} from "@nestjs/graphql";
import {TimeSlotStatus} from "@prisma/client";
import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

@InputType()
export class UpdateTimeSlotsInput {

    @IsNotEmpty()
    @IsNumber({},{each: true})
    @Field(() => [Int])
    timeSlotIds: number[];

    @IsOptional()
    @IsNumber()
    @Field(() => Float, { nullable: true })
    price?: number;

    @IsOptional()
    @IsString({message: "Must be string"})
    @Field(() => TimeSlotStatus, { nullable: true })
    status?: TimeSlotStatus;

    @IsOptional()
    @IsDate()
    @Field({ nullable: true })
    temporaryBlockDate?: Date;
}

registerEnumType(TimeSlotStatus, {
    name: 'TimeSlotStatus',
});