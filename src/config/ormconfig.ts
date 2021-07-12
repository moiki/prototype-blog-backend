import { ConnectionOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();
const { MONGO_DATABASE_URL, MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD } =
  process.env;
const config: ConnectionOptions = {
  type: "mongodb",
  url: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DATABASE_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  port: 27017,
  entities: ["src/model/**/**.entity{.ts,.js}"],
  synchronize: false,
  migrations: ["src/migrations/**/*.ts"],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export = config;
