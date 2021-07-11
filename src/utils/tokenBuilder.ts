import { sign } from "jsonwebtoken";

export const CreateToken = (payload: any, key: string, expiration?: string) => {
  const token = sign(
    {
      ...payload,
    },
    key,
    {
      expiresIn: expiration,
    }
  );
  return token;
};
