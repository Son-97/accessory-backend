import { InputType, Field } from "type-graphql";

@InputType()
export class RemoveAccessoryInput {
  @Field()
  accessoryId: number;

  @Field((_type) => [Number], { nullable: true })
  productIds!: number[];
}
