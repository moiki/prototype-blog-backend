import { compare, hash } from "bcryptjs";
import "dotenv/config";
import ErrorHandler from "../../middlewares/errorHandler";

export default {
  hashPassword: async (password: string): Promise<string> => {
    try {
      console.log(password);
      const pass = await hash(password, 10);
      return pass;
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(error.message);
    }
  },

  testPassword: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await compare(password, hashedPassword);
  },
};
