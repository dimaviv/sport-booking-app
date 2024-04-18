import {Resolver, Query, Args} from '@nestjs/graphql';
import { LocationService } from './location.service';
import {City, District} from "./location.types";


@Resolver()
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}


  @Query(() => [City])
  async findAllCities() {
    return this.locationService.findAllCities();
  }

  @Query(() => [District])
  async findAllDistricts(@Args('cityId') cityId: number,) {
    return this.locationService.findAllDistricts(cityId);
  }

}
