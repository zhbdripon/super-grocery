import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "../configs/constants";

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, BCRYPT_SALT_ROUNDS);

export const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);
