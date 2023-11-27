import bcrypt from "bcrypt";
import { LETTERS_AND_NUMBERS } from "#constants/letters.constants.js";

export function hashPassword(plainPassword: string): string {
  const saltRounds: number =
    !!process.env.SALT_ROUNDS && isNaN(+process.env.SALT_ROUNDS) ? parseInt(process.env.SALT_ROUNDS) : 10;
  const hashedPassword: string = bcrypt.hashSync(plainPassword, saltRounds);
  return hashedPassword;
}

export function comparePassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export function generateRandomPassword(size: number): string{
  let password = '';
  for (let i = 0; i < size; i++) {
    password += LETTERS_AND_NUMBERS.charAt(Math.floor(Math.random()*LETTERS_AND_NUMBERS.length));
  }

  return password;
}
