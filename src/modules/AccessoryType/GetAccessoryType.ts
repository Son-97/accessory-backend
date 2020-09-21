import { Resolver, Query, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AccessoryType } from "../../entities/AccessoryType";
import { AccessoryTypeRepository } from "../../repositories/AccessoryTypeRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => AccessoryType)
export class GetAccessoryTypes {
  constructor(
    @InjectRepository(AccessoryType)
    private readonly accessoryTypeReponsitory: AccessoryTypeRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Query(() => [AccessoryType])
  public async getAccessoryTypes(): Promise<AccessoryType[]> {
    return await this.accessoryTypeReponsitory.getAccessoryTypes();
  }
}
