import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class City {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => [District], { nullable: 'itemsAndList' }) // 'itemsAndList' makes both the array and its items nullable
  districts?: District[];
}

@ObjectType()
export class District {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field(() => City)
  city: City;
}
