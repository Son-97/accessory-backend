import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Accessory } from "../../entities/Accessory";
import { CreateAccessoryInput } from "./inputs/Accessory/CreateAccessoryInput";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { AccessoryProductRepository } from "../../repositories/AccessoryProductRepository";
import { AccessoryTypeRepository } from "../../repositories/AccessoryTypeRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Accessory)
export class CreateAccessory {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: AccessoryRepository,
    @InjectRepository(AccessoryProductRepository)
    private readonly accessoryProductRepository: AccessoryProductRepository,
    @InjectRepository(AccessoryTypeRepository)
    private readonly accessoryTypeRepository: AccessoryTypeRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Accessory)
  async createAccessory(
    @Arg("data") dataInput: CreateAccessoryInput
  ): Promise<Accessory> {
    const accessoryType = await this.accessoryTypeRepository.findOne(
      dataInput.accessoryTypeId
    );
    if (!accessoryType) {
      throw new Error("Accessory Type is not found");
    }

    const accessory = this.accessoryRepository.create({
      ...dataInput,
      accessoryType: accessoryType,
    });
    await this.accessoryRepository.save(accessory);

    if (dataInput.productIds) {
      await this.accessoryProductRepository.createOrUpdateAccessoryProducts(
        accessory,
        dataInput.productIds
      );
    }

    return accessory;
  }
}
