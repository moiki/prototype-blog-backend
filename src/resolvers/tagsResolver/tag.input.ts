import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class TagInput {
  @Field({nullable: true})
  id: string;
  @Field()
  name: string;
  @Field({nullable: true})
  description: string;
}