import { Resolver, Mutation, Arg } from "type-graphql";
import bcrypt from "bcryptjs";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloError } from "apollo-server-express";

import { User } from "../../entities/User";
import { RegisterInput } from "../../inputs/User/CreateUserInput";
import { UserRepository } from "../../repositories/UserRepository";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";
import { confirmUserPrefix } from "../../constants/redisPrefixes";

@Resolver((_type) => User)
export class Register {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  @Mutation(() => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new ApolloError(
        `Email ${data.email} already registered.`,
        "BAD_REQUEST"
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.userRepository
      .create({
        ...data,
        password: hashedPassword,
        isRegistered: true,
      })
      .save();

    await sendEmail(
      data.email,
      await createConfirmationUrl(user.id, confirmUserPrefix)
    );

    return user;
  }
}
