import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CategoryInput {
  @Field({nullable: true})
  id: string;
  @Field()
  name: string;
  @Field({nullable: true})
  description: string;
}