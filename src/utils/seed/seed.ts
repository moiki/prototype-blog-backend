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
    role_name: "Root",
    description:
      "This role represents a Master User which has access to all functions and modules of the system.",
  },
  {
    is_active: true,
    role_name: "Administrator",
    description:
      "Administrator can manage Clinics, Employees and Routes modules.",
  },
  {
    is_active: true,
    role_name: "Local Member",
    description: "This role can manage Pacients module.",
  },
  {
    is_active: true,
    role_name: "Support Doctor",
    description:
      "This role has access to the pacients informations in order to track every case.",
  },
  {
    is_active: true,
    role_name: "Sponsor",
    description:
      "This role has access to pacient, clinics and routes information.",
  },
];

export const seed_user = {
  first_name: "Master",
  last_name: "Root",
  email: process.env.MASTER_ROOT_EMAIL,
  phone_number: "+111111111111",
  profession: "System Administrator",
  email_confirmed: true,
  address: "None Address yet",
};

export const setup = async () => {
  try {
  } catch (error) {
    console.log(error.message);
  }
};
