import { EntityRepository, Repository } from "typeorm";

import { AccessoryType } from "../entities/AccessoryType";

@EntityRepository(AccessoryType)
export class AccessoryTypeRepository extends Repository<AccessoryType> {
  public async getAccessoryTypes(): Promise<AccessoryType[]> {
    return this.createQueryBuilder().getMany();
  }
}
