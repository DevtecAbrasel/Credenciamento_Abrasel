import { CreationAttributes, Transaction } from "sequelize";

import { Invitee, InviteeDTO } from "#interfaces/invitee.interface.js";
import { InviteeModel } from "#models/invitee.model.js";
import { isNumeric } from "#utils/string.util.js";
import { EventModel } from "../models/event.model.js";
import eventInviteeService from "./event-invitee.service.js";
import { Event } from "../interfaces/event.interface.js";

class InviteeService {
  // GET
  public async findAll(): Promise<InviteeDTO[]> {
    let excludeAttrs = ["createdAt", "updatedAt"];
    const invitee: InviteeDTO[] = await InviteeModel.findAll({
      attributes: { exclude: excludeAttrs },
      include: {
        model: EventModel,
        attributes: { exclude: excludeAttrs },
        through: { attributes: [] },
      },
    });
    return invitee;
  }

  public async findById(id: number): Promise<InviteeDTO | null> {
    let excludeAttrs = ["createdAt", "updatedAt"];
    const invitee: InviteeDTO | null = await InviteeModel.findOne({
      where: { id: id },
      attributes: {
        exclude: excludeAttrs,
      },
    });
    return invitee;
  }

  public async findByFields(whereValues: object): Promise<Array<InviteeDTO> | null> {
    let excludeAttrs = ["createdAt", "updatedAt"];
    const invitee: Array<InviteeDTO> | null = await InviteeModel.findAll({
      where: { ...whereValues },
      attributes: {
        exclude: excludeAttrs,
      },
    });
    return invitee;
  }

  // POST
  public async create(inviteeParams: InviteeDTO, t?: Transaction): Promise<InviteeDTO> {
    let inviteeParamsNoId: CreationAttributes<Invitee> = (({ id: _, ...rest }) => ({
      ...rest,
    }))(inviteeParams);

    const invitee: Invitee = await InviteeModel.create(inviteeParamsNoId, { transaction: t });

    const { createdAt: a, updateAt: b, ...inviteeFiltered } = invitee.dataValues;

    let event: Event | Object = {};

    try {
      if (!!inviteeParams.eventId) {
        event = await eventInviteeService.add(invitee, "addEvent", inviteeParams.eventId, EventModel, t);
      }
    } catch (error: any) {
      throw error;
    }

    return { ...inviteeFiltered, event: { ...event } };
  }

  // PUT
  public async update(inviteeParams: InviteeDTO, t?: Transaction): Promise<InviteeDTO> {
    // Validação do update
    if (!inviteeParams.id) {
      throw new Error("A requisição não possui o id do convidado.");
    }

    const inviteeFound = await this.findById(inviteeParams.id);

    if (!inviteeFound) {
      throw new Error("O convidado não foi encontrado.");
    }

    const [count] = await InviteeModel.update(inviteeParams, {
      where: { id: inviteeParams.id },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Erro na atualização do convidado!");
    }

    return {
      id: inviteeParams.id,
      email: inviteeParams.email ?? inviteeFound.email,
    };
  }

  public async deleteById(id: number, t?: Transaction): Promise<InviteeDTO> {
    if (!id) {
      throw new Error("Não foi enviado o id do convidado!");
    }

    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const invitee = await Invitee.findByPk(id);
    const count = await InviteeModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("O convidado não existe");
    }

    return { id: invitee!.id, email: invitee!.email };
  }

  // Funções não CRUD

  public async addEvent(eventId: number, inviteeId?: number, inviteeEmail?: string): Promise<any> {
    if ((!inviteeId && !inviteeEmail) || !eventId) {
      throw new Error("Parâmetros insuficientes!");
    }
    const inviteeWhere = inviteeId ? { id: inviteeId } : { email: inviteeEmail };

    const invitee = await InviteeModel.findOne({ where: inviteeWhere, attributes: { exclude: ["createdAt", "updatedAt"] } });

    const event = await eventInviteeService.add(invitee, "addEvent", eventId, EventModel);

    return { ...invitee?.dataValues, event: { ...event } };
  }
}

export default new InviteeService();
