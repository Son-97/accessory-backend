import { Field, ObjectType } from "type-graphql";
import { Accessory } from "../../../entities/Accessory";

@ObjectType()
export class GetAccessoriesResponse {
  @Field((_type) => [Accessory], { nullable: true })
  public accessories?: Accessory[];

  @Field()
  public page!: number;

  @Field()
  public limit!: number;

  @Field()
  public totalResults!: number;
}
