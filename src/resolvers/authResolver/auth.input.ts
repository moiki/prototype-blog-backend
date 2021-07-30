import { IsDefined, IsEmail } from "class-validator";
import { Match } from "../../utils/match.decorator";
import { ArgsType, Field, InputType } from "type-graphql";

@InputType("LoginInput", { description: "Inputs for login query" })
export class LoginInput {
  @Field({ nullable: false, description: "Email Field" })
  email: string;
  @Field({ description: "Password Field" })
  password: string;
}

@ArgsType()
export class UserInput {
  @Field({ nullable: true })
  id: string;
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field()
  @IsEmail({}, { message: "Email provided is invalid." })
  email: string;
  @Field()
  phone_number: string;
  @Field()
  profession: string;
  @Field({ defaultValue: false, nullable: true })
  is_invited: boolean;
  @Field({ nullable: true })
  address: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  city: string;
  @Field()
  password: string;
  @Field(() => [String])
  roles: string[];
}

@ArgsType()
export class UserUpdateInput {
  @Field()
  id: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field({ nullable: true })
  @IsEmail()
  email: string;
  @Field()
  phone_number: string;
  @Field(() => String)
  role: string;
}

@ArgsType()
export class PasswordResetRequestArg {
  @Field({ nullable: false })
  @IsEmail(undefined, { message: "The provided email is invalid" })
  email: string;
}
@ArgsType()
export class PasswordResetArg {
  @IsDefined({ message: "Please provide a new password" })
  @Field({ nullable: false })
  password: string;
  @IsDefined({ message: "Please provide the confirmation of the new password" })
  @Match("password", { message: "Confirmation does not match!" })
  @Field({ nullable: false })
  confirm_password: string;
  @Field({ nullable: false })
  token: string;
}
