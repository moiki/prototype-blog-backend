import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class PostInput {
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  title: string;
  @Field()
  thumbnail: string;
  @Field()
  featured_picture: string;
  @Field(() => [String])
  categories: string[];
  @Field(() => [String])
  tags: String[];
  @Field()
  content: string;
}
