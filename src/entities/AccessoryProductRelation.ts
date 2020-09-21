import { Field, ID, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";
import { Accessory } from "./Accessory";

@ObjectType()
@Entity()
@Unique(["product", "accessory"])
export class AccessoryProductRelation {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  // Accessory - Product relationship
  @Field((_type) => Product)
  @ManyToOne((_type) => Product, (product: Product) => product.id)
  @JoinColumn({ name: "productId" })
  public product!: Product;

  @RelationId(
    (accessoryProductRelation: AccessoryProductRelation) =>
      accessoryProductRelation.product
  )
  public productId!: number;

  // Accessory - Product relationship
  @Field((_type) => Accessory)
  @ManyToOne((_type) => Accessory, (accessory: Accessory) => accessory.id)
  @JoinColumn({ name: "accessoryId" })
  public accessory!: Accessory;

  @RelationId(
    (accessoryProductRelation: AccessoryProductRelation) =>
      accessoryProductRelation.accessory
  )
  public accessoryId!: number;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
