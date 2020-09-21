import { EntityRepository, Repository } from "typeorm";

import { ThumbnailImage } from "../entities/ThumbnailImage";

@EntityRepository(ThumbnailImage)
export class ThumbnailImageRepository extends Repository<ThumbnailImage> {}
