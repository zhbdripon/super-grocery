import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "../configs/constants";

export const hashData = (plain: string): Promise<string> =>
  bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);

export const verifyHash = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
