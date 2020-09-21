import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { User } from "../../entities/User";
import { redis } from "../../redis";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";
import { ChangePasswordInput } from "../../inputs/User/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";
import { UserRepository } from "../../repositories/UserRepository";

@Resolver((_type) => User)
export class ChangePassword {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg("data")
    { token, password }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      throw new ApolloError("Token does not exist", "NOT_FOUND");
    }

    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new ApolloError("User does not exist", "NOT_FOUND");
    }

    await redis.del(forgotPasswordPrefix + token);

    user.password = await bcrypt.hash(password, 12);

    await user.save();

    ctx.req.session!.userId = user.id;

    return user;
  }
}
