import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import "dotenv/config";
import ErrorHandler from "../../middlewares/errorHandler";

const ENCRYPTION_KEY: any = process.env.CRYPTO_SECRET_KEY;
const IV_LENGTH = 16;

export default {
  encrypt: (message: string) => {
    try {
      // random initialization vector
      const iv = crypto.randomBytes(IV_LENGTH);
      // random salt
      const salt = crypto.randomBytes(64);
      // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
      // a large number of iterations. It may can replaced by HKDF
      const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 1024, 32, "sha512");
      // AES 256 GCM Mode
      const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
      // encrypt the given text
      const encrypted = Buffer.concat([
        cipher.update(message, "utf8"),
        cipher.final(),
      ]);
      // extract the auth tag
      const tag = cipher.getAuthTag();
      // generate output
      return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
    } catch (e) {
      console.log(e.message);
    }
    // error
    return "";
  },
  decrypt: (message: string) => {
    try {
      const data = Buffer.from(message, "base64");

      const salt = data.slice(0, 64);
      const iv = data.slice(64, 80);
      const tag = data.slice(80, 96);
      const text = data.slice(96);
      // derive key using; 32 byte key length
      const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 1024, 32, "sha512");
      // AES 256 GCM Mode
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);
      // encrypt the given text
      const decrypted =
        decipher.update(text, "binary", "utf8") + decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.log(error.message);
    }
    return "";
  },
  hashPassword: async (password: string): Promise<string> => {
    try {
      console.log(password);
      const pass = await hash(password, 10);
      return pass;
    } catch (error) {
      console.log(error);
      throw new ErrorHandler(error.message);
    }
  },

  testPassword: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await compare(password, hashedPassword);
  },
};
