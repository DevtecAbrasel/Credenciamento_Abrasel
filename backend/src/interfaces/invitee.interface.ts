import { BelongsToManyAddAssociationMixin, Model } from "sequelize";
import { Event } from "#interfaces/event.interface.js";

export class Invitee extends Model {
  public declare readonly id: number;
  public declare email: string;
  public declare name: string;
  public declare cellphone: string;
  public declare company: string;
  public declare role: string;
  public declare uf: string;
  public declare addEvent: BelongsToManyAddAssociationMixin<Event, Event["id"]>;
}

export interface InviteeDTO {
  id: number;
  email: string;
  name?: string;
  cellphone?: string;
  company?: string;
  role?: string;
  uf?: string;
  createdAt?: Date;
  updatedAt?: Date;
  addEvent?: BelongsToManyAddAssociationMixin<Event, Event["id"]>;
  eventId?: number;
}
