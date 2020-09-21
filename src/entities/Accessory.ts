import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AccessoryProductRelation } from "./AccessoryProductRelation";
import { AccessoryType } from "./AccessoryType";
import { ThumbnailImage } from "./ThumbnailImage";

@Entity()
@ObjectType()
export class Accessory {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field()
  @Column({ nullable: true })
  image: string;

  @Field()
  @Column({ nullable: true })
  oldPrice: number;

  @Field()
  @Column({ nullable: true })
  price: number;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ type: "longtext", nullable: true })
  description: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  // Accessory - Product relationship
  @Field((_type) => [AccessoryProductRelation], { nullable: true })
  @OneToMany(
    (_type) => AccessoryProductRelation,
    (accessoryProductRelation: AccessoryProductRelation) =>
      accessoryProductRelation.accessory
  )
  accessoryProductRelations?: AccessoryProductRelation[];

  // Accessory - AccessoryType relationship
  @Field((_type) => AccessoryType, { nullable: true })
  @ManyToOne(
    (_type) => AccessoryType,
    (accessoryType: AccessoryType) => accessoryType.id
  )
  @JoinColumn({ name: "accessoryTypeId" })
  public accessoryType: AccessoryType;

  @RelationId((a: Accessory) => a.accessoryType)
  public accessoryTypeId!: number;

  @Field((_type) => [ThumbnailImage], { nullable: true })
  @OneToMany(
    (_type) => ThumbnailImage,
    (image: ThumbnailImage) => image.accessory
  )
  thumbnail?: ThumbnailImage[];
}
