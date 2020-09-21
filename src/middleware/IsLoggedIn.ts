import { AuthenticationError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const IsLoggedIn: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  if (!context.req.session!.userId) {
    throw new AuthenticationError("Unauthorired");
  }

  return next();
};

export default IsLoggedIn;
