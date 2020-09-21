import { Field, ObjectType } from "type-graphql";

import { Accessory } from "../../../entities/Accessory";

@ObjectType()
export class SearchAccessoryResponse {
  @Field((_type) => [Accessory], { nullable: true })
  public accessories?: Accessory[];
}
