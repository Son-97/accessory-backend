import { InputType, Field } from "type-graphql";
import { IsNotEmpty, Length } from "class-validator";

@InputType()
export class UpdateAccessoryTypeInput {
  @Field()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;
}
