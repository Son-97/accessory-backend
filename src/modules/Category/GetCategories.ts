import { Resolver, Query, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Category } from "../../entities/Category";
import { CategoryRepository } from "../../repositories/CategoryRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => Category)
export class GetCategories {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Query(() => [Category])
  public async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.getCategories();
  }
}
