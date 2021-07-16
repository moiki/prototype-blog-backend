import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PostList {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field()
  author: string;
  @Field()
  thumbnail: string;
  @Field()
  categories: string[];
  @Field()
  tags: string[];
}

@ObjectType()
export class SinglePost {
  @Field()
  id: string;
  @Field()
  slug: string;
  @Field()
  title: string;
  @Field()
  author: string;
  @Field()
  thumbnail: string;
   @Field()
  featured_picture: string;
   @Field()
  publicationDate: string;
  @Field()
  categories: string[];
  @Field()
  tags: string[];
  @Field()
  content: string;
}