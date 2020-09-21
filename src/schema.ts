import { buildSchema } from "type-graphql";

import { Register } from "./modules/User/Register";
import { Login } from "./modules/User/Login";
import { Me } from "./modules/User/Me";
import { ConfirmUserByEmail } from "./modules/user/ConfirmUserByEmail";
import { ForgotPassword } from "./modules/User/ForgotPassword";
import { ChangePassword } from "./modules/User/ChangePassword";
import { Logout } from "./modules/User/Logout";

import { GetCategories } from "./modules/Category/GetCategories";
import { CreateCategory } from "./modules/Category/CreateCategory";
import { UpdateCategory } from "./modules/Category/UpdateCategory";

import { GetProducts } from "./modules/Product/GetProducts";
import { CreateProduct } from "./modules/Product/CreateProduct";
import { UpdateProduct } from "./modules/Product/UpdateProduct";

import { GetAccessoryTypes } from "./modules/AccessoryType/GetAccessoryType";
import { CreateAccessoryType } from "./modules/AccessoryType/CreateAccessoryType";
import { UpdateAccessoryType } from "./modules/AccessoryType/UpdateAccessoryType";

import { GetAccessories } from "./modules/Accessory/GetAccessories";
import { CreateAccessory } from "./modules/Accessory/CreateAccessory";
import { UpdateAccessory } from "./modules/Accessory/UpdateAccessory";
import { RemoveAccessory } from "./modules/Accessory/RemoveAccessory";
import { SearchAccessories } from "./modules/Accessory/SearchAccessoty";

import { UpdateThumbnailImage } from "./modules/ThumbnailImage/UpdateImage";

export default (Container: any) => {
  return buildSchema({
    container: Container,
    resolvers: [
      Register,
      Login,
      Me,
      ConfirmUserByEmail,
      ForgotPassword,
      ChangePassword,
      Logout,

      GetCategories,
      CreateCategory,
      UpdateCategory,

      GetProducts,
      CreateProduct,
      UpdateProduct,

      GetAccessories,
      CreateAccessory,
      UpdateAccessory,
      RemoveAccessory,
      SearchAccessories,

      GetAccessoryTypes,
      CreateAccessoryType,
      UpdateAccessoryType,

      UpdateThumbnailImage,
    ],
  });
};
