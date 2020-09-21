import { InputType, Field } from "type-graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field((_type) => Number)
  categoryId!: number;
}
