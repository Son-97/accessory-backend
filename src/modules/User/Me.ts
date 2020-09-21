import { Resolver, Query, Ctx, UseMiddleware } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";

import { User } from "../../entities/User";
import { MyContext } from "../../types/MyContext";
import { UserRepository } from "../../repositories/UserRepository";
import { IsLoggedIn } from "../../middleware/IsLoggedIn";

@Resolver((_type) => User)
export class Me {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}
  @UseMiddleware(IsLoggedIn)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return this.userRepository.findOne(ctx.req.session!.userId);
  }
}
