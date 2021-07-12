import * as dotenv from "dotenv";
dotenv.config();

export interface IRoles {
  role_name: string;
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
    description:
      "Administrator can manage Clinics, Employees and Routes modules.",
  },
];

export const seed_user = {
  first_name: String(process.env.MASTER_ROOT_NAME).split(" ")[0] || "Manfred",
  last_name: String(process.env.MASTER_ROOT_NAME).split(" ")[1] || "Tijerino",
  email: process.env.MASTER_ROOT_EMAIL,
  phone_number: "+111111111111",
  profession: "Administrator",
  email_confirmed: true,
  address: "None Address Set",
};

export const setup = async () => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};
