import { Max, Min } from "class-validator";
import { Field, InputType, registerEnumType } from "type-graphql";
import { GetAccessoriesSearchFieldsInput } from "./GetAccessorySearchFieldsInput";

enum GetAccessorySortBy {
  name = "accessory.name",
  price = "accessory.price",
}

registerEnumType(GetAccessorySortBy, {
  name: "GetAccessorySortBy",
});

@InputType()
export class GetAccessoriesInput {
  @Field({ nullable: true })
  public q?: GetAccessoriesSearchFieldsInput;

  @Field({ nullable: true, defaultValue: 1 })
  @Min(1)
  public page?: number;

  @Field({ nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(50)
  public limit?: number;

  @Field((_type) => GetAccessorySortBy, { nullable: true })
  public sortBy?: GetAccessorySortBy;

  @Field({ nullable: true, defaultValue: false })
  public sortDesc?: boolean;
}
