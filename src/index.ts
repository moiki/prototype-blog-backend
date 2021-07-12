import "reflect-metadata";
import { magenta } from "chalk";
import { createConnection } from "typeorm";
import { startServer } from "./app";
import config from "./config/ormconfig";
import ErrorHandler from "./middlewares/errorHandler";
import { seedInitial } from "./seeder";

export const dbConnect = async () => {
  await createConnection(config);
  // await conn.runMigrations();
  console.log(`I'm Connected to DB Server`);
};

async function main() {
  try {
    dbConnect().then(async () => {
      const seeded = await seedInitial();
      if (seeded) {
        console.log("Initial Seed executed successfully!");
      }
    });
    const server = await startServer();
    server.listen(3200);
    console.log(magenta(`🚀 Server ready at http://localhost:${3200}/graphql`));
  } catch (error) {
    throw new ErrorHandler(error.message, error.code);
  }
}

main();
