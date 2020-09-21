import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Category } from "../../entities/Category";
import { CreateCategoryInput } from "../../inputs/Category/CreateCategoryInput";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Category)
export class UpdateCategory {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Mutation(() => Category)
  public async updateCategory(
    @Arg("id") id: number,
    @Arg("data") data: CreateCategoryInput
  ): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder()
      .where("id = :id", {
        id: id,
      })
      .getOne();

    if (!category) {
      throw new Error("Category is not found");
    }
    this.categoryRepository.merge(category, data);

    return await this.categoryRepository.save(category);
  }
}
