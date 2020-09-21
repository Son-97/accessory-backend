import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Accessory } from "../../entities/Accessory";
import { UpdateAccessoryInput } from "./inputs/Accessory/UpdateAccessoryInput";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { AccessoryProductRepository } from "../../repositories/AccessoryProductRepository";
import { AccessoryTypeRepository } from "../../repositories/AccessoryTypeRepository";

import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Accessory)
export class UpdateAccessory {
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
  public async updateAccessory(
    @Arg("id") id: number,
    @Arg("data") dataInput: UpdateAccessoryInput
  ): Promise<Accessory> {
    const accessory = await this.accessoryRepository
      .createQueryBuilder()
      .where("id = :id", {
        id: id,
      })
      .getOne();

    if (!accessory) {
      throw new Error("Accessory is not found");
    }

    const accessoryType = await this.accessoryTypeRepository.findOne(
      dataInput.accessoryTypeId
    );
    if (!accessoryType) {
      throw new Error("Accessory Type is not found");
    }

    this.accessoryRepository.merge(accessory, {
      ...dataInput,
      accessoryType: accessoryType,
    });

    if (dataInput.productIds) {
      await this.accessoryProductRepository.createOrUpdateAccessoryProducts(
        accessory,
        dataInput.productIds
      );
    }

    return await this.accessoryRepository.save(accessory);
  }
}
