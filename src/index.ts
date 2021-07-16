import "reflect-metadata";
import { magenta } from "chalk";
import { startServer } from "./app";
import ErrorHandler from "./middlewares/errorHandler";
import { MongooseConnection } from "./config/mongooseConfig";
import { InitialSet } from "./utils/seed/seed";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    MongooseConnection().then(async () => {
      console.log(`I'm Connected to DB Server`);
      const setup = await InitialSet();
      if (setup) {
        console.log("Initial Seed executed successfully!");
      }
    });
    const server = await startServer();
    server.listen(process.env.PORT || 5000);
    console.log(
      magenta(
        `🚀 API is running at http://localhost:${process.env.PORT}/graphql`
      )
    );
  } catch (error) {
    throw new ErrorHandler(error.message, error.code);
  }
}

main();
