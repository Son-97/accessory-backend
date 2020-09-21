import { Field, InputType } from "type-graphql";
import { SearchByInterface } from "../../../shared/paginationQuery";

export const searchBy: SearchByInterface = {
  name: "accessory.name",
  price: "accessory.price",
};

@InputType({ description: "Search fields" })
export class GetAccessoriesSearchFieldsInput {
  @Field({ nullable: true })
  public name?: string;

  @Field({ nullable: true })
  public price?: string;
}
