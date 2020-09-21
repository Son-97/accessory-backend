import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Accessory } from "../../entities/Accessory";
// import { RemoveAccessoryInput } from "../../inputs/Accessory/RemoveAccessoryInput";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { AccessoryProductRepository } from "../../repositories/AccessoryProductRepository";
// import { ProductRepository } from "../../repositories/ProductRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Accessory)
export class RemoveAccessory {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: AccessoryRepository,
    @InjectRepository(AccessoryProductRepository)
    private readonly accessoryProductRepository: AccessoryProductRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Boolean)
  async removeAccessory(
    @Arg("accessoryId") accessoryId: number
  ): Promise<boolean> {
    // find accessory and product
    const accessory = await this.accessoryRepository.findOne(accessoryId);
    if (!accessory) {
      throw new Error("Accessory is not found");
    }

    await this.accessoryProductRepository
      .createQueryBuilder("accessory_product_relation")
      .delete()
      .where("accessoryId = :accessoryId ", {
        accessoryId: accessory.id,
      })
      .execute();

    await this.accessoryRepository.remove(accessory);

    return true;
  }
}
