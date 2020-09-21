import { Resolver, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { redis } from "../../redis";
import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { confirmUserPrefix } from "../../constants/redisPrefixes";

@Resolver((_type) => User)
export class ConfirmUserByEmail {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  @Mutation(() => Boolean)
  async confirmUser(@Arg("token") token: string): Promise<boolean> {
    const userId = await redis.get(confirmUserPrefix + token);

    if (!userId) {
      throw new ApolloError("Token does not exist", "NOT_FOUND");
    }

    await this.userRepository.update(
      { id: parseInt(userId, 10) },
      { confirmed: true }
    );
    await redis.del(confirmUserPrefix + token);

    return true;
  }
}
