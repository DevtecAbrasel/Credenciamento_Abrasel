import { Model } from "sequelize";

export class Manager extends Model {
  declare public readonly id: number;
  declare public email: string;
  declare public name: string;
  declare public password: string;
  declare public origin: string; // Nacional/Seccional/Regional
}

export interface ManagerDTO {
  id: number;
  email: string;
  name: string;
  password?: string;
  origin: string;
}