import { MiddlewareFn } from "type-graphql";

import { MyContext } from "../types/MyContext";

export const Logger: MiddlewareFn<MyContext> = async ({ args }, next) => {
  console.log("args: ", args);

  return next();
};
