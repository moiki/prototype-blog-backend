import { getMongoRepository } from "typeorm";
import { Roles } from "./model/roles.entity";
import { seed_roles, seed_user } from "./utils/seed/seed";
import crypt from "./utils/crypto/index";
import { User } from "./model/user.entity";
import { cyan, red } from "chalk";
import ErrorHandler from "./middlewares/errorHandler";

import * as dotenv from "dotenv";
dotenv.config();

const { MASTER_ROOT_PASSWORD = "demo@1234", MASTER_ROOT_EMAIL } = process.env;

export const seedInitial = async () => {
  try {
    const userRepo = getMongoRepository(User);
    const totalUsers = await User.find();
    if (totalUsers.length > 0) {
      return false;
    }
    const theresRoles = await Roles.findOne({ where: { role_name: "Root" } });
    if (theresRoles) {
      // let user = new User();
      const user = {
        //  ...user,
        ...seed_user,
        is_active: true,
        comentaries: [],
        email: MASTER_ROOT_EMAIL!,
        profile_picture: "null",
        roles: [theresRoles],
        hashed_password: await crypt.hashPassword(MASTER_ROOT_PASSWORD),
      };
      await userRepo.save(user);
      console.log(
        cyan(
          "***********************DEFAULT USER HAVE BEEN INSERTED*******************************"
        )
      );
    } else {
      const savedRoles: Roles[] = await Promise.all(
        seed_roles.map(async (v) => {
          return await getMongoRepository(Roles).save(v);
        })
      );
      const rootRole = savedRoles.find((role) => role.role_name === "Root");

      const user = {
        ...seed_user,
        is_active: true,
        comentaries: [],
        profile_picture: "null",
        roles: [rootRole!],
        hashed_password: await crypt.hashPassword("demo1234"),
      };
      await userRepo.save(user);
      console.log(
        cyan(
          "***********************DEFAULT USER HAVE BEEN INSERTED*******************************"
        )
      );
    }
    return true;
  } catch (error) {
    throw new ErrorHandler(red("Error of Seed:", error.message));
  }
};
