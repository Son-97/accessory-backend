import { Field, InputType } from "type-graphql";

@InputType()
export class SearchAccessoryInput {
  @Field((_type) => String)
  public query!: string;
}
