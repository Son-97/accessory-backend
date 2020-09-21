import { Field, InputType } from "type-graphql";
import { MinLength } from "class-validator";

@InputType()
export class ChangePasswordInput {
  @Field()
  token!: string;

  @Field()
  @MinLength(8, {
    message: "Password is too short.",
  })
  password: string;
}
