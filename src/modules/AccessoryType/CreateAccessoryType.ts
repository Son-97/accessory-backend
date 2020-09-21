import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AccessoryType } from "../../entities/AccessoryType";
import { AccessoryTypeRepository } from "../../repositories/AccessoryTypeRepository";
import { CreateAccessoryTypeInput } from "./inputs/CreateAccessoryTypeInput";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => AccessoryType)
export class CreateAccessoryType {
  constructor(
    @InjectRepository(AccessoryType)
    private readonly accessoryTypeRepository: AccessoryTypeRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Mutation(() => AccessoryType)
  async createAccessoryType(
    @Arg("data") data: CreateAccessoryTypeInput
  ): Promise<AccessoryType> {
    const accessoryType = this.accessoryTypeRepository.create(data);
    return this.accessoryTypeRepository.save(accessoryType);
  }
}
