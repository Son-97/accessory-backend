import { Length, IsEmail, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "../../utils/isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "Email $value already registered." })
  email: string;

  @Field()
  @MinLength(8, {
    message: "Password is too short.",
  })
  password: string;
}
