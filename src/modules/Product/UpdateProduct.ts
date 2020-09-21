import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/ProductRepository";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { CreateProductInput } from "../../inputs/Product/CreateProductInput";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Product)
export class UpdateProduct {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Product)
  async updateProduct(
    @Arg("id") id: number,
    @Arg("data") dataInput: CreateProductInput
  ): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new ApolloError("Product is not found");
    }

    const category = await this.categoryRepository.findOne(
      dataInput.categoryId
    );

    if (!category) {
      throw new ApolloError("Category is not found");
    }

    this.productRepository.merge(product, { ...dataInput, category: category });

    return await this.productRepository.save(product);
  }
}
