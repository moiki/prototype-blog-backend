import {
  Arg,
  Args,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import * as dotenv from "dotenv";
import { LoginResponse } from "./auth.output";
import crypto from "../../utils/crypto";
import ErrorHandler from "../../middlewares/errorHandler";
import { CreateToken } from "../../utils/tokenBuilder";
import { User, userModel } from "../../model/user.mongo";
import { verify } from "jsonwebtoken";
import { IMyContext } from "../../MyGraphContext";
import { roleModel } from "../../model/role.mongo";
import { PasswordResetArg, PasswordResetRequestArg } from "./auth.input";
import jwt from "jsonwebtoken";
import EmailProvider from "../../utils/email/index";
import resetPasswordTemplate from "../../utils/email/resetPassword.template";
dotenv.config();

const {
  JWT_API_SECRET = "Tempo003",
  CRYPTO_SECRET_KEY = "Tempo001",
  EXPIRATION_TIME = "1d",
  PASSWORD_RESET_REQUEST_EXPIRY,
  GLOBAL_SECRET,
  DOMAIN,
} = process.env;
@Resolver()
export default class AuthResolver {
  /** Query Section */
  @Query(() => String)
  async refreshToken(
    @Arg("refreshToken", { nullable: false }) refreshToken: string
  ): Promise<String> {
    try {
      // Verify the token is valid
      const payload: any = verify(refreshToken, CRYPTO_SECRET_KEY);

      // Look up the user in the DB
      const user = await userModel.findOne({ _id: payload.user });

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

  @Query(() => User)
  @Authorized()
  async sessionUserInfo(@Ctx() { payload }: IMyContext): Promise<User | any> {
    try {
      const cu = await userModel.findOne({ _id: payload?.id }).populate("role");
      if (!cu) {
        throw new ErrorHandler("There's a Problem with this user", 403);
      }
      return cu;
    } catch (error) {
      throw new ErrorHandler(error.message, error.code);
    }
  }
  /** Mutation Section */
  @Mutation(() => LoginResponse, { nullable: true })
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const user_exist = await userModel
        .findOne({ email: email })
        .populate("role");

      if (!user_exist) {
        throw new ErrorHandler("User does not exist!", 401);
      }

      const userRole = await roleModel.findById(user_exist.role);
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
          role: userRole?.usedFor,
          name: `${user_exist.firstName} ${user_exist.lastName}`,
        },
        CRYPTO_SECRET_KEY,
        EXPIRATION_TIME
      );
      const accessToken = CreateToken(
        {
          user: user_exist._id,
          fullName: `${user_exist.firstName} ${user_exist.lastName}`,
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

  @Query(() => Boolean)
  async PasswordResetRequest(
    @Args() { email }: PasswordResetRequestArg
  ): Promise<Boolean> {
    try {
      // locate the user within the database
      const user = await userModel.findOne({ email: email });

      // If no user end operations and return true
      if (!user) {
        throw new ErrorHandler("This email is not registered.", 404);
      }

      // Create a hash that will ensure the user is requesting a pw reset
      const hash = jwt.sign(
        {
          email: user.email,
          version: user.passwordRecoveryVersion,
        },
        GLOBAL_SECRET!,
        { expiresIn: PASSWORD_RESET_REQUEST_EXPIRY }
      );

      // Setup email constructor
      const emailProvider = new EmailProvider({
        template: resetPasswordTemplate(
          `${user.firstName}`,
          `${DOMAIN}?code=${hash}`
        ),
        subject: "Password Recovery",
        to: email,
      });

      // Send Email to validate account
      await emailProvider.sendEmail();

      // Return true no matter the outcome
      return true;
    } catch ({ message, error }) {
      throw new ErrorHandler(message, error);
    }
  }

  @Query(() => String)
  async passwordTokenConfirm(
    @Arg("token", { nullable: false }) token: string
  ): Promise<string> {
    try {
      const payload: any = jwt.verify(token, GLOBAL_SECRET!);
      const { email, version } = payload;

      // locate the user within the database
      const user = await userModel.findOne({ email: email });
      // If no user end operations and return true
      if (!user) {
        throw new ErrorHandler(
          "Error finding the user, please try later.",
          404
        );
      }
      if (user.passwordRecoveryVersion !== version) {
        throw new ErrorHandler("This code is no longer available.", 401);
      }
      return `${user.firstName} ${user.lastName}`;
    } catch ({ message, error }) {
      throw new ErrorHandler(message, error);
    }
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args() reset: PasswordResetArg) {
    try {
      const { password, confirm_password, token } = reset;
      if (password !== confirm_password) {
        throw new ErrorHandler(
          "The password and its confirmation doen't match!",
          401
        );
      }
      const payload: any = jwt.verify(token, GLOBAL_SECRET!);
      const { email, version } = payload;

      // locate the user within the database
      const user = await userModel.findOne({ email: email });
      // If no user end operations and return true
      if (!user) {
        throw new ErrorHandler(
          "Error finding the user, please try later.",
          404
        );
      }
      user.hashed_password = await crypto.hashPassword(password);
      user.passwordRecoveryVersion = version + 1;
      await userModel.updateOne({ _id: user._id }, user);
      return true;
    } catch ({ message, error }) {
      throw new ErrorHandler(message, error);
    }
  }
}
