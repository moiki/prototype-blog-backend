import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as dotenv from "dotenv";
import { LoginResponse } from "./auth.output";
import crypto from "src/utils/crypto";
import ErrorHandler from '../../middlewares/errorHandler';
import { CreateToken } from "../../utils/tokenBuilder";
import { userModel } from "src/model/user.mongo";
import { verify } from "jsonwebtoken";
dotenv.config();

const {
  JWT_API_SECRET = "Tempo003",
  CRYPTO_SECRET_KEY = "Tempo001",
  EXPIRATION_TIME = "1d",
  // ROLE_KEY = "Tempo0002",
} = process.env;
@Resolver()
export default class AuthResolver {
@Mutation(() => LoginResponse, { nullable: true })
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const user_exist = await userModel.findOne({email: email});
      if (!user_exist) {
        throw new ErrorHandler("User does not exist!", 401);
      }

      const isPass = await crypto.testPassword(
        password,
        user_exist.hashed_password
      );
      if (!isPass) {
        throw new ErrorHandler("Invalid Credentials!", 401);
      }

      const refreshToken = CreateToken(
        {
          user: user_exist.id,
          name: `${user_exist.firstName} ${user_exist.lastName}`,
        },
        CRYPTO_SECRET_KEY,
        EXPIRATION_TIME
      );
      const accessToken = CreateToken(
        {
          user: user_exist._id,
        },
        JWT_API_SECRET,
        EXPIRATION_TIME
      );

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }

  @Query(() => String)
  async refreshToken(
    @Arg("refreshToken", { nullable: false }) refreshToken: string
  ): Promise<String> {
    try {
      // Verify the token is valid
      const payload: any = verify(refreshToken, CRYPTO_SECRET_KEY);

      // Look up the user in the DB
      const user = await userModel.findOne({_id: payload.user});

      // If the user doesnt exist return error
      if (!user) {
        throw new ErrorHandler("Invalid token", 400);
      }

      // Create new payload
      const newToken = CreateToken(
        {
          user: user._id,
        },
        JWT_API_SECRET,
        EXPIRATION_TIME
      );

      return newToken;
    } catch ({ message, code }) {
      throw new ErrorHandler(message, code);
    }
  }
}