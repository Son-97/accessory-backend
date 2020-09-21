import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { LoginInput } from "../../inputs/User/LoginInput";
import { MyContext } from "../../types/MyContext";

@Resolver((_type) => User)
export class Login {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("data") data: LoginInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      email: data.email,
      isRegistered: true,
    });

    if (!user) {
      throw new ApolloError("User does not exist", "NOT_FOUND");
    }

    const valid = await bcrypt.compare(data.password, user.password);

    if (!valid) {
      throw new ApolloError("Password incorrect", "NOT_FOUND");
    }

    if (!user.confirmed) {
      throw new ApolloError("Incorrect credentials", "NOT_FOUND");
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
