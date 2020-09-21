import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateAccessoryInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field((_type) => [Number], { nullable: true })
  productIds!: number[];

  @Field((_type) => Number)
  accessoryTypeId!: number;
}
