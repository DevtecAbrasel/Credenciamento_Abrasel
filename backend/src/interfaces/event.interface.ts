import { Model } from "sequelize";

export class Event extends Model {
  declare public readonly id: number;
  declare public name: string;
  declare public start: Date;
  declare public finish: Date;
  declare public location: string;
}

export interface EventDTO {
  id: number;
  name: string;
  start?: Date | string;
  finish?: Date | string;
  location?: string;
}