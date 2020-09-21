import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Accessory } from "./Accessory";

@Entity()
@ObjectType()
export class ThumbnailImage {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  imageURL: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublic: boolean;

  @Field(() => Boolean)
  @Column({ default: false })
  mainPhoto: boolean;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field((_type) => Accessory)
  @ManyToOne((_type) => Accessory, (a: Accessory) => a.id)
  @JoinColumn({ name: "accessoryId" })
  public accessory: Accessory;

  @RelationId((t: ThumbnailImage) => t.accessory)
  public accessoryId!: number;
}
