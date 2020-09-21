import { Resolver, Query, UseMiddleware, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/ProductRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Product)
export class GetProducts {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Query(() => [Product])
  public async getProductsByCategoryId(
    @Arg("categoryId") categoryId: number
  ): Promise<Product[]> {
    const a = await this.productRepository
      .createQueryBuilder("product")
      .where("product.categoryId = :categoryId", {
        categoryId,
      })
      .leftJoinAndSelect(
        "product.accessoryProductRelation",
        "product_accessory_relation"
      )
      .leftJoinAndSelect("product_accessory_relation.accessory", "accessory")
      .getMany();
    return a;
  }

  @UseMiddleware(IsLoggedIn)
  @Query(() => [Product])
  public async getProducts(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect(
        "product.accessoryProductRelation",
        "product_accessory_relation"
      )
      .leftJoinAndSelect("product_accessory_relation.accessory", "accessory")
      .getMany();
  }
}
