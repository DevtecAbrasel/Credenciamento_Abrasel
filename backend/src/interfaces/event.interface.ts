import { Model } from "sequelize";

export class Event extends Model {
  public declare readonly id: number;
  public declare name: string;
  public declare start: Date;
  public declare finish: Date;
  public declare location: string;
  public declare price: number;
  public declare inviteeLimit: number;
  public declare origin: string;
  public declare createdAt: Date;
  public declare updatedAt: Date;
}

export interface EventDTO {
  id: number;
  name: string;
  start?: Date | string;
  finish?: Date | string;
  location?: string;
  price?: number;
  attendantLimit?: number;
  origin?: string;
}
