import { Query, Resolver } from "type-graphql";

@Resolver()
export class PingResolver {
  @Query((_returns) => String, {
    nullable: true,
    description: "Example for simple query!",
  })
  async ping(): Promise<String> {
    return "Pong!";
  }
}
