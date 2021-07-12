import { mongoose } from '@typegoose/typegoose';
import * as dotenv from "dotenv";
dotenv.config();

export const MongooseConnection = async () => {
  await mongoose.connect(String(process.env.MONGO_DATABASE_URL), {
    useNewUrlParser: true,
    // dbName: DB_NAME,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}