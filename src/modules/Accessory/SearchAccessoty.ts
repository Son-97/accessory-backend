import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Accessory } from "../../entities/Accessory";
import IsLoggedIn from "../../middleware/IsLoggedIn";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { SearchAccessoryInput } from "./inputs/SearchAccessoryInput";

@Resolver((_type) => Accessory)
export class SearchAccessories {
  constructor(
    @InjectRepository(Accessory)
    private readonly accessoryRepository: AccessoryRepository
  ) {}

  @UseMiddleware(IsLoggedIn)
  @Query((_type) => [Accessory])
  public async searchAccessories(
    @Arg("data") inputData: SearchAccessoryInput
  ): Promise<Accessory[]> {
    // fetch accessories
    const query = this.accessoryRepository.createQueryBuilder("accessory");

    if (inputData.query.length) {
      const searchQuery = `%${inputData.query}%`;
      query
        .where(
          // Search accessory have name like search string
          "(accessory.name LIKE :searchQuery)",
          { searchQuery }
        )
        .getMany();
    }

    query.orderBy("accessory.name").limit(10);
    const accessories = await query.getMany();

    return accessories;
  }
}
