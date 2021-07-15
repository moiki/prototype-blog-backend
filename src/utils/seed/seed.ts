import { cyan } from "chalk";
import * as dotenv from "dotenv";
import { categoryModel } from "../../model/category.mongo";
import { roleModel } from "../../model/role.mongo";
import { userModel } from "../../model/user.mongo";
dotenv.config();

const {
  MASTER_ROOT_PASSWORD = "demo@1234",
  MASTER_ROOT_EMAIL,
  MASTER_ROOT_NAME,
} = process.env;
export interface IRoles {
  name: string;
  description: string;
  is_active: boolean;
}
export const seed_roles = [
  {
    is_active: true,
    name: "Master",
    usedFor: "master",
    description:
      "This role represents a Master User which has access to all functions and modules of the system.",
  },
  {
    is_active: true,
    name: "Administrator",
    usedFor: "administrator",
    description: "Limited Aministrator Role",
  },
];

const seed_user = {
  firstName: String(MASTER_ROOT_NAME).split(" ")[0] || "Manfred",
  lastName: String(MASTER_ROOT_NAME).split(" ")[1] || "Tijerino",
  email: MASTER_ROOT_EMAIL,
  phone_number: "+111111111111",
  email_confirmed: true,
};

export const InitialSet = async () => {
  try {
    if ((await userModel.estimatedDocumentCount()) > 0) {
      return false;
    }
    const user = {
      ...seed_user,
      is_active: true,
      email: MASTER_ROOT_EMAIL,
      hashed_password: MASTER_ROOT_PASSWORD,
    };
    if ((await roleModel.estimatedDocumentCount()) > 0) {
      await userModel.create(user);
    } else {
      const new_roles = await Promise.all(
        seed_roles.map(async (role) => {
          return await roleModel.create(role);
        })
      );
      if (new_roles.length > 0) await userModel.create(user);
      console.log(
        cyan(
          "***************|| DEFAULT MASTER USER HAVE BEEN CREATED ||*********************"
        )
      );
    }
    if ((await categoryModel.estimatedDocumentCount()) === 0) {
      const firstCategory = await categoryModel.create({
        name: "General",
        description: "General Category for blog posts",
      });
      if (firstCategory) {
        console.log(cyan("First category created"));
      }
    }
    return true;
  } catch (error) {
    console.log("Error details: ", error.message);
    return false;
  }
};
