import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Category } from "../../entities/Category";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { CreateCategoryInput } from "../../inputs/Category/CreateCategoryInput";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Category)
export class CreateCategory {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Category)
  async createCategory(
    @Arg("data") data: CreateCategoryInput
  ): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }
}
