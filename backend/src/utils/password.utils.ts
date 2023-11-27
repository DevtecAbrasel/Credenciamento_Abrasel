import bcrypt from "bcrypt";

export function hashPassword(plainPassword: string): string {
  const saltRounds: number =
    !!process.env.SALT_ROUNDS && isNaN(+process.env.SALT_ROUNDS) ? parseInt(process.env.SALT_ROUNDS) : 10;
  const hashedPassword: string = bcrypt.hashSync(plainPassword, saltRounds);
  return hashedPassword;
}

export function comparePassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}
