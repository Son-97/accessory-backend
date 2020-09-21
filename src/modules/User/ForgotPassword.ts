import { Resolver, Mutation, Arg } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { forgotPasswordPrefix } from "../../constants/redisPrefixes";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { sendEmail } from "../../utils/sendEmail";

@Resolver((_type) => User)
export class ForgotPassword {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new ApolloError("User does not exist", "NOT_FOUND");
    }

    await sendEmail(
      email,
      await createConfirmationUrl(user.id, forgotPasswordPrefix)
    );

    return true;
  }
}
