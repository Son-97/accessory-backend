import { EntityRepository, Repository } from "typeorm";

import { Accessory } from "../entities/Accessory";

@EntityRepository(Accessory)
export class AccessoryRepository extends Repository<Accessory> {}
