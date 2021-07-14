import { ApolloServer } from "apollo-server-express";
import express, { json } from "express";
import enforce from "express-sslify";
import cors from "cors";
import helmet from "helmet";
import { buildSchema } from "type-graphql";
// import { AuthResolver } from "./resolvers/authResolver/auth.resolver";
// import { PingResolver } from "./resolvers/ping";
import { red, gray } from "chalk";
import authChecker from "./middlewares/authChecker";
import * as dotenv from "dotenv";
import ErrorHandler from "./middlewares/errorHandler";
import { PingResolver } from "./resolvers/ping";
import AuthResolver from "./resolvers/authResolver";
dotenv.config();
const contextService = require("request-context");
const { NODE_ENV, ALLOWED_ORIGINS } = process.env;

export async function startServer() {
  const app = express();
  // Create production basic security
  // Add context service middleware
  app.use(contextService.middleware("req"));
  if (NODE_ENV === "production") {
    app.use(json({ limit: "2mb" }));
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    app.use(helmet());
    app.disable("x-powered-by");
    app.use(
      cors({
        origin: (origin, callback) => {
          if (
            JSON.parse(ALLOWED_ORIGINS!).includes(origin!) ||
            origin === undefined
          ) {
            return callback(null, true);
          }
          throw new ErrorHandler("The origin is not allowed", 500);
        },
      })
    );
  }
  const graph_server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        PingResolver,
        AuthResolver,
      ],
      authChecker: authChecker,
    }),
    formatError: (err) => {
      const message = err.message.toLowerCase();
      if (message.includes("argument validation error")) {
        const error = err.extensions!.exception.validationErrors.map(
          (u: any) => u.constraints
        );
        err.message = error.map((u: any) => Object.values(u));
        err.extensions!.code = "BAD_REQUEST";
      } else if (
        message.includes("invalid signature") ||
        message.includes("invalid token")
      ) {
        err.message = "Invalid request";
        err.extensions!.code = "UNAUTHENTICATED";
      }

      console.log(red(err.message), gray(err.extensions?.code));
      return err;
    },
    context: ({ req, res }) => ({ req, res }),
  });

  graph_server.applyMiddleware({ app, path: "/graphql" });
  return app;
}
