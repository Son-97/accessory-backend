import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateAccessoryInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field((_type) => [Number], { nullable: true })
  productIds!: number[];

  @Field((_type) => Number)
  @IsNotEmpty()
  accessoryTypeId!: number;
}
