import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { Product } from "../../entities/Product";
import { ProductRepository } from "../../repositories/ProductRepository";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { CreateProductInput } from "../../inputs/Product/CreateProductInput";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Product)
export class CreateProduct {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Product)
  async createProduct(
    @Arg("data") dataInput: CreateProductInput
  ): Promise<Product> {
    const category = await this.categoryRepository.findOne(
      dataInput.categoryId
    );
    if (!category) {
      throw new ApolloError("Category is not found");
    }

    const product = this.productRepository.create({
      ...dataInput,
      category: category,
    });

    return this.productRepository.save(product);
  }
}
