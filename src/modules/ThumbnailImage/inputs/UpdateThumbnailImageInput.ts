import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateThumbnailInput {
  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  mainPhoto?: boolean;

  @Field((_type) => Number)
  accessoryId!: number;
}
