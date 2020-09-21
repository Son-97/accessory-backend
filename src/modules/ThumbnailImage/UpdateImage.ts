import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";
import { ThumbnailImage } from "../../entities/ThumbnailImage";
import { ThumbnailImageRepository } from "../../repositories/ThumbnailImageRepository";
import { UpdateThumbnailInput } from "./inputs/UpdateThumbnailImageInput";
import { AccessoryRepository } from "../../repositories/AccessoryReponsitory";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => ThumbnailImage)
export class UpdateThumbnailImage {
  constructor(
    @InjectRepository(ThumbnailImageRepository)
    private readonly thumbnailImageRepository: ThumbnailImageRepository,
    @InjectRepository(AccessoryRepository)
    private readonly accessoryRepository: AccessoryRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Mutation(() => ThumbnailImage)
  async updateThumbnailImage(
    @Arg("id") id: number,
    @Arg("data") dataInput: UpdateThumbnailInput
  ): Promise<ThumbnailImage> {
    const image = await this.thumbnailImageRepository.findOne(id);
    if (!image) {
      throw new ApolloError("Image is not found");
    }

    const accessory = await this.accessoryRepository.findOne(
      dataInput.accessoryId
    );

    if (!accessory) {
      throw new ApolloError("Accessory is not found");
    }

    this.thumbnailImageRepository.merge(image, {
      ...dataInput,
    });

    return await this.thumbnailImageRepository.save(image);
  }
}
