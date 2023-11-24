import { Model } from "sequelize";

export class User extends Model {
  declare public readonly id: number;
  declare public email: string;
  declare public name: string;
  declare public password: string;
}

export interface UserDTO {
  id: number;
  email: string;
  name: string;
  password?: string;
}