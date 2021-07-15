import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class CategoryOutput {
  @Field(() => ID, { nullable: true })
  id: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  description: string;
}