import { ObjectType, Field } from '@nestjs/graphql';
import {User} from "../user/user.type";
import {Facility} from "../facility/facility.types";

@ObjectType()
export class Rating {
  @Field()
  id?: number;

  @Field()
  value: string;

  @Field()
  userId: number;

  @Field(() => User)
  user: User;

  @Field()
  facilityId: number;

  @Field(() => Facility)
  facility: Facility;
}
