import { Model } from "sequelize";

export class Manager extends Model {
  declare public readonly id: number;
  declare public email: string;
  declare public name: string;
  declare public password: string;
}

export interface ManagerDTO {
  id: number;
  email: string;
  name: string;
  password?: string;
}