import { Field, InputType } from "type-graphql";

@InputType()
export class AddBookToCategoriesInput {
  @Field((_type) => [Number])
  public bookIds!: number[];

  @Field((_type) => [Number])
  public categoryIDs!: number[];
}
