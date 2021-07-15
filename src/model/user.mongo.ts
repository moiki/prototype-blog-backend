import { ObjectType } from "type-graphql";
import {
  prop,
  Ref,
  // arrayProp,
  pre,
  mongoose,
  // post,
  plugin,
  modelOptions,
  getModelForClass,
} from "@typegoose/typegoose";
import { Field, ID } from "type-graphql";
import { Role, roleModel } from "./role.mongo";
import { Base } from "./abstract/base.mongo";
import mongoPaginate from "../utils/mongoPaginate";
import Error from "../middlewares/errorHandler";
import crypto from "../utils/crypto";

// const { GLOBAL_SECRET, EMAIL_VERIFICATION_EXPIRY } = process.env;

@pre<User>("save", async function (next): Promise<void> {
  if (this.isNew) {
    // Keep the is new data for post hook
    this.wasNew = this.isNew;

    // Hash the password before saving
    this.hashed_password = await crypto.hashPassword(this.hashed_password);
    // Get the admin and base role
    const adminRole = await roleModel.findOne({ usedFor: "master" }, { id: 1 });
    const baseRole = await roleModel.findOne(
      { usedFor: "administrator" },
      { id: 1 }
    );

    // Assign the admin role if is the first user on the DB
    if ((await userModel.estimatedDocumentCount()) > 0) {
      this.role = mongoose.Types.ObjectId(baseRole!._id);
    } else {
      this.role = mongoose.Types.ObjectId(adminRole!._id);
    }
  }

  next();
})
@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true } })
@plugin(mongoPaginate)
export class User extends Base {
  @Field(() => ID)
  id: string;

  // Used to overcome limitiations in post hook https://github.com/Automattic/mongoose/issues/2162
  wasNew: boolean;

  @prop({ required: true, index: true, text: true })
  @Field({ nullable: false })
  firstName: string;

  @prop({ required: true })
  @Field({ nullable: false })
  lastName: string;

  @prop({ lowercase: true, required: true })
  @Field({ nullable: false })
  email: string;

  @prop({ required: true })
  hashed_password: string;

  @prop({ ref: "Role", text: true })
  @Field(() => Role, { nullable: false })
  role: Ref<Role>;

  @prop({ default: 1 })
  tokenVersion: number;

  @prop({ default: 1 })
  passwordRecoveryVersion: number;

  @prop({ default: false, text: true })
  @Field()
  verified: boolean;
}

interface createUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export const createUser = ({
  email,
  password,
  firstName,
  lastName,
  confirmPassword,
}: createUser): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if the user exists in the DB
      const user = await userModel.findOne({ email });

      // Throw error if user already exists
      if (user) {
        throw new Error(
          "Unable to process your request with the provided email",
          400
        );
      }

      // if user does not exist proceed to chech that the passwords match
      if (password !== confirmPassword) {
        throw new Error("The passwords do not match", 400);
      }

      // If the passwords match proceed to create the user
      const newUser = await userModel.create({
        firstName,
        lastName,
        password,
        email,
      });

      resolve(newUser);
    } catch (e) {
      reject(e);
    }
  });
};

export const userModel = getModelForClass(User);
