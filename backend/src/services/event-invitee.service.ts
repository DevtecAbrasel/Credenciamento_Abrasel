import { Transaction } from "sequelize";
import { sqliteConnection } from "#databases/sqlite.db.js";

class EventInviteeService {
  public async add(eventId: number, inviteeId: number, t?: Transaction): Promise<any> {
    if (!eventId || !inviteeId) {
      throw new Error("Parâmetros faltando para a função");
    }

    const connection = sqliteConnection.models;

    const alreadyExist = await connection.event_invitee?.findAll({ where: { EventId: eventId, InviteeId: inviteeId } });

    if (alreadyExist && alreadyExist?.length > 0) {
      throw new Error("Convidado já adicionado ao evento!");
    }

    const entity: any = await connection.event_invitee?.create({ EventId: eventId, InviteeId: inviteeId }, { transaction: t });

    return entity.dataValues;
  }

  public async remove(eventId: number, inviteeId: number, t?: Transaction): Promise<number> {
    if (!eventId || !inviteeId) {
      throw new Error("Parâmetros insuficientes!");
    }

    const count = await sqliteConnection.models.event_invitee?.destroy({
      where: {
        EventId: eventId,
        InviteeId: inviteeId,
      },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Convidado não pôde ser removido do evento.");
    }

    return count;
  }
}

export default new EventInviteeService();
