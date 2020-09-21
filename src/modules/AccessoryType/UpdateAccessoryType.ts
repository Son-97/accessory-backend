import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { AccessoryType } from "../../entities/AccessoryType";
import { UpdateAccessoryTypeInput } from "./inputs/UpdateAccessoryTypeInput";
import { AccessoryTypeRepository } from "../../repositories/AccessoryTypeRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => AccessoryType)
export class UpdateAccessoryType {
  constructor(
    @InjectRepository(AccessoryType)
    private readonly accessoryTypeRepository: AccessoryTypeRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Mutation(() => AccessoryType)
  public async updateAccessoryType(
    @Arg("id") id: number,
    @Arg("data") data: UpdateAccessoryTypeInput
  ): Promise<AccessoryType> {
    const accessoryType = await this.accessoryTypeRepository
      .createQueryBuilder()
      .where("id = :id", {
        id: id,
      })
      .getOne();

    if (!accessoryType) {
      throw new Error("Accessory Type is not found");
    }
    this.accessoryTypeRepository.merge(accessoryType, data);

    return await this.accessoryTypeRepository.save(accessoryType);
  }
}
