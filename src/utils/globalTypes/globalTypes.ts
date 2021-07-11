import { Field, ObjectType } from "type-graphql";

@ObjectType({ isAbstract: true })
export abstract class GeneralResponse {
  @Field()
  status: boolean;
  @Field()
  message: string;
}
