import { Resolver, Query, UseMiddleware, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Accessory } from "../../entities/Accessory";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";
import { GetAccessoriesResponse } from "./inputs/GetAccessoriesResponse";
import { GetAccessoriesInput } from "./inputs/GetAccessoriesInput";
import paginationQuery from "../../shared/paginationQuery";
import { searchBy } from "./inputs/GetAccessorySearchFieldsInput";

@Resolver((_type) => Accessory)
export class GetAccessories {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: AccessoryRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Query((_return) => GetAccessoriesResponse)
  public async getAccessories(
    @Arg("data") inputData: GetAccessoriesInput
  ): Promise<GetAccessoriesResponse> {
    const query = this.accessoryRepository
      .createQueryBuilder("accessory")
      .leftJoinAndSelect(
        "accessory.accessoryProductRelations",
        "product_accessory_relation"
      )
      .leftJoinAndSelect("product_accessory_relation.product", "product")
      .leftJoinAndSelect("accessory.accessoryType", "accessory_type")
      .leftJoinAndSelect(
        "accessory.thumbnail",
        "thumbnail_image",
        "thumbnail_image.isPublic = :isPublic",
        { isPublic: true }
      );
    // add pagination params to query
    paginationQuery({
      query,
      searchBy,
      inputData,
    });
    // fetch accessories
    const [accessories, totalResults] = await query.getManyAndCount();

    return {
      page: inputData.page as number,
      limit: inputData.limit as number,
      totalResults,
      accessories,
    };
  }

  @UseMiddleware(IsLoggedIn)
  @Query(() => [Accessory])
  public async getAccessoryByAccessoryTypeID(
    @Arg("accessoryTypeId") accessoryTypeId: number
  ): Promise<Accessory[]> {
    return await this.accessoryRepository
      .createQueryBuilder("accessory")
      .where("accessory.accessoryTypeId = :accessoryTypeId", {
        accessoryTypeId,
      })
      .getMany();
  }
}
