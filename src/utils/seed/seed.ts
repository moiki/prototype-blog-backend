import * as dotenv from "dotenv";
import { roleModel } from "src/model/role.mongo";
import { userModel } from "src/model/user.mongo";
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
    role_name: "Master",
    description:
      "This role represents a Master User which has access to all functions and modules of the system.",
  },
  {
    is_active: true,
    role_name: "Administrator",
    description: "Limited Aministrator Role",
  },
];

export const seed_user = {
  first_name: String(MASTER_ROOT_NAME).split(" ")[0] || "Manfred",
  last_name: String(MASTER_ROOT_NAME).split(" ")[1] || "Tijerino",
  email: MASTER_ROOT_EMAIL,
  phone_number: "+111111111111",
  profession: "Administrator",
  email_confirmed: true,
  address: "None Address Set",
};

export const InitialSet = async () => {
  try {
    const user = {
      //  ...user,
      ...seed_user,
      is_active: true,
      email: MASTER_ROOT_EMAIL!,
      hashed_password: MASTER_ROOT_PASSWORD,
    };
    const rolesExist = await roleModel.find();
    if (!(rolesExist.length === 0)) {
      await userModel.create(user);
    } else {
      const new_roles = await Promise.all(
        seed_roles.map(async (role) => {
          return await roleModel.create(role);
        })
      );
      if (new_roles.length > 0) await userModel.create(user);
    }
  } catch (error) {
    console.log(error.message);
  }
};
