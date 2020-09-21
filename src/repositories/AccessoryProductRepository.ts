import _ from "lodash";
import { EntityRepository, Repository, getCustomRepository } from "typeorm";

import { AccessoryProductRelation } from "../entities/AccessoryProductRelation";
import { Accessory } from "../entities/Accessory";
import { ProductRepository } from "../repositories/ProductRepository";

@EntityRepository(AccessoryProductRelation)
export class AccessoryProductRepository extends Repository<
  AccessoryProductRelation
> {
  private productRepository = getCustomRepository(ProductRepository);

  public async createOrUpdateAccessoryProducts(
    accessory: Accessory,
    newProductIds: number[]
  ) {
    const accessoryProductInstances: AccessoryProductRelation[] = [];
    const addedAccessories = await this.find({ where: { accessory } });

    const addedAccessoryIds = addedAccessories.map((a) => a.productId);

    // Remove accessory
    const accessoryIdsToRemove = _.without(addedAccessoryIds, ...newProductIds);

    // Add new accessories
    const accessoryIdsToAdd = _.without(newProductIds, ...addedAccessoryIds);

    if (accessoryIdsToAdd.length) {
      const products = await this.productRepository.findByIds(
        accessoryIdsToAdd
      );

      products.forEach((product) => {
        const newAccessoryProduct = this.create({
          accessory,
          product,
        });
        accessoryProductInstances.push(newAccessoryProduct);
      });

      if (accessoryProductInstances.length > 0) {
        await this.createQueryBuilder()
          .insert()
          .orIgnore(true)
          .values(accessoryProductInstances)
          .updateEntity(false)
          .execute();
      }
    }
    if (accessoryIdsToRemove.length) {
      await this.createQueryBuilder()
        .delete()
        .where("accessoryId = :accessoryId AND productId IN(:...productIds)", {
          accessoryId: accessory.id,
          productIds: accessoryIdsToRemove,
        })
        .execute();
    }
  }
}
