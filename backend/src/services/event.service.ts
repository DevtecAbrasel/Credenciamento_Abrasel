import { CreationAttributes, Transaction } from "sequelize";

import { Event, EventDTO } from "#interfaces/event.interface.js";
import { EventModel } from "#models/event.model.js";
import { isNumeric } from "#utils/string.util.js";
import { stringToDate } from "#utils/date.utils.js";
import { RecepcionistModel } from "#models/recepcionist.model.js";
import { InviteeModel } from "../models/invitee.model.js";
import eventInviteeService from "./event-invitee.service.js";

class EventService {
  // GET
  public async findAll(): Promise<EventDTO[]> {
    const excludeAttrs = ["createdAt", "updatedAt"];
    const event: EventDTO[] = await EventModel.findAll({
      attributes: { exclude: excludeAttrs },
      include: [
        {
          model: RecepcionistModel,
          attributes: { exclude: [...excludeAttrs, "password"] },
        },
        {
          model: InviteeModel,
          attributes: { exclude: excludeAttrs },
          through: {
            attributes: [],
          },
        },
      ],
    });
    return event;
  }

  public async findById(id: number): Promise<EventDTO | null> {
    let excludeAttrs = ["createdAt", "updatedAt"];
    const event: EventDTO | null = (
      await EventModel.findOne({
        where: { id: id },
        attributes: {
          exclude: excludeAttrs,
        },
      })
    )?.dataValues;
    return event;
  }

  public async findByFields(whereValues: object): Promise<Array<EventDTO> | null> {
    let excludeAttrs = ["createdAt", "updatedAt"];
    const event: Array<EventDTO> | null = await EventModel.findAll({
      where: { ...whereValues },
      attributes: {
        exclude: excludeAttrs,
      },
    });
    return event;
  }

  // POST
  public async create(eventParams: EventDTO, t?: Transaction): Promise<EventDTO> {
    let eventParamsNoId: CreationAttributes<Event> = (({ id: _, ...rest }) => ({
      ...rest,
    }))(eventParams);

    eventParamsNoId.start = stringToDate(eventParamsNoId.start);
    eventParamsNoId.finish = stringToDate(eventParamsNoId.finish);

    const event: Event = await EventModel.create(eventParamsNoId, { transaction: t });

    const { createdAt: a1, updatedAt: a2, ...eventValues } = event.dataValues;

    return {
      ...eventValues,
      start: event.start.toLocaleDateString(),
      finish: event.finish.toLocaleDateString(),
    };
  }

  // PUT
  public async update(eventParams: EventDTO, t?: Transaction): Promise<EventDTO> {
    // Validação do update
    if (!eventParams.id) {
      throw new Error("A requisição não possui o id do evento.");
    }

    const eventFound = await this.findById(eventParams.id);

    if (!eventFound) {
      throw new Error("O evento não foi encontrado.");
    }

    const startDateString: any = eventParams.start;
    const finishDateString: any = eventParams.finish;

    eventParams.start = eventParams.start ? stringToDate(startDateString) : undefined;
    eventParams.finish = eventParams.finish ? stringToDate(finishDateString) : undefined;

    const [count] = await EventModel.update(eventParams, {
      where: { id: eventParams.id },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Erro na atualização do evento!");
    }

    return {
      ...eventParams,
      start: startDateString,
      finish: finishDateString,
    };
  }

  // DELETE
  public async deleteById(id: number, t?: Transaction): Promise<EventDTO> {
    if (!id) {
      throw new Error("Não foi enviado o id do evento!");
    }

    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const event = await Event.findByPk(id);
    const count = await EventModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("O evento não existe");
    }

    return { id: event!.id, name: event!.name, location: event!.location };
  }

  // Extra CRUD
  public async addInvitee(eventId: number, inviteeId?: number, inviteeEmail?: string): Promise<any> {
    if ((!inviteeId && !inviteeEmail) || !eventId) {
      throw new Error("Parâmetros insuficientes!");
    }
    const inviteeWhere = inviteeId ? { id: inviteeId } : { email: inviteeEmail };

    const invitee = (await InviteeModel.findOne({ where: inviteeWhere, attributes: { exclude: ["createdAt", "updatedAt"] } }))
      ?.dataValues;

    if (!invitee) {
      throw new Error("O convidado não existe.");
    }

    await eventInviteeService.add(eventId, invitee?.id);

    const event: EventDTO | null = await this.findById(eventId);

    return { ...event, invitee: { ...invitee } };
  }

  public async removeInvitee(eventId: number, inviteeId?: number, inviteeEmail?: string, t?: Transaction) {
    if ((!inviteeId && !inviteeEmail) || !eventId) {
      throw new Error("Parâmetros insuficientes!");
    }
    const inviteeWhere = inviteeId ? { id: inviteeId } : { email: inviteeEmail };

    const invitee = (await InviteeModel.findOne({ where: inviteeWhere, attributes: ["id", "email"] }))?.dataValues;

    if (!invitee) {
      throw new Error("O convidado não existe.");
    }

    await eventInviteeService.remove(eventId, invitee?.id, t);

    const event: EventDTO | null = await this.findById(eventId);

    return { ...event, invitee: { ...invitee } };
  }
}

export default new EventService();
