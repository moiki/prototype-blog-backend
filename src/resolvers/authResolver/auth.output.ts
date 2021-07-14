import { Field, ObjectType } from "type-graphql";
import { GeneralResponse } from "../../utils/globalTypes/globalTypes";

@ObjectType()
export class UserListResponse {
  @Field({ nullable: true })
  id: string;
  @Field()
  first_name: string;
  @Field({ nullable: true })
  last_name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  password: string;
}

@ObjectType()
export class RolesListResponse {
  @Field({ nullable: true })
  id: string;
  @Field()
  role_name: string;
  @Field()
  description: string;
}

@ObjectType()
export class CurrentUser {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  first_name: string;
  @Field({ nullable: true })
  last_name: string;
  @Field()
  full_name: string;
  @Field()
  email: string;
  @Field({ nullable: true })
  phone: string;
  @Field()
  profession: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  address: string;
  @Field()
  created_date: string;
  @Field(() => [RolesListResponse], { nullable: true })
  roles: RolesListResponse[];
}

@ObjectType({ description: "Response for CRUD action for Users" })
export class AuthCrudresponse extends GeneralResponse {
  @Field({ nullable: true })
  id: string;
}

@ObjectType({ description: "Data for authentication" })
export class LoginResponse {
  @Field()
  refreshToken: string;
  @Field()
  accessToken: string;
}

@ObjectType({ description: "Invitation List" })
export class InvitationResponse {
  @Field({ nullable: true })
  id: string;
  @Field()
  email: string;
  @Field()
  idRole: string;
  @Field()
  answered: string;
  @Field({ nullable: true })
  created_date: string;
}

@ObjectType()
export class InvitationCheckResponse {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  role_id: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  role_name: string;
  @Field({ nullable: true })
  accepted: boolean;
}