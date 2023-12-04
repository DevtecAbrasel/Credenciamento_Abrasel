import { Model } from "sequelize";
import { Event } from "./event.interface.js";

export class Recepcionist extends Model {
  declare public readonly id: number;
  declare public cellphone: string;
  declare public name: string;
  declare public password: string;
  declare public eventId: number;
  declare public event: Event;
}

export interface RecepcionistDTO {
  id: number;
  cellphone: string;
  name?: string;
  password?: string;
  eventId: number;
  event?: Event;
}