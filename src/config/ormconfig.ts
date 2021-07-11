import { ConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();
const config: ConnectionOptions = {
  type: "mongodb",
  host: process.env.MONGO_DATABASE_URL,
  entities: ["src/models/**/**.entity{.ts,.js}"],
  synchronize: false,
  migrations: ["src/migrations/**/*.ts"],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export = config;
