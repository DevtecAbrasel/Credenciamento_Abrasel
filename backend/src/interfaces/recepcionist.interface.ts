import { Model } from "sequelize";

export class Recepcionist extends Model {
  declare public readonly id: number;
  declare public cellphone: string;
  declare public name: string;
  declare public password: string;
}

export interface RecepcionistDTO {
  id: number;
  cellphone: string;
  name: string;
  password?: string;
}