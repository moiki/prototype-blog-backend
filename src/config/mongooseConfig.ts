import { mongoose } from "@typegoose/typegoose";
import * as dotenv from "dotenv";
dotenv.config();
const { MONGO_DATABASE_URL, MONGO_DATABASE, MONGO_USER, MONGO_PASSWORD } =
  process.env;
export const MongooseConnection = async () => {
  await mongoose.connect(
    `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DATABASE_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      dbName: MONGO_DATABASE,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  );
};
