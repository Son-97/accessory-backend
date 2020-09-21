import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Category } from "./Category";
import { AccessoryProductRelation } from "./AccessoryProductRelation";

@Entity()
@ObjectType()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  // Category - Product relationship (1-n)
  @Field((_type) => Category, { nullable: true })
  @ManyToOne((_type) => Category, (category: Category) => category.id)
  @JoinColumn({ name: "categoryId" })
  public category: Category;

  @RelationId((c: Product) => c.category)
  public categoryId!: number;

  // Accessory - Product relationship(n-n)
  @Field((_type) => [AccessoryProductRelation], { nullable: true })
  @OneToMany(
    (_type) => AccessoryProductRelation,
    (accessoryProductRelation: AccessoryProductRelation) =>
      accessoryProductRelation.product
  )
  public accessoryProductRelation?: AccessoryProductRelation[];
}
