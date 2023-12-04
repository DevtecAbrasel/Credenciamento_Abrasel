import { Transaction } from "sequelize";

class EventInviteeService {
  public async add(sourceInstance: any, addFunctionName: string, id: number, model: any, t?: Transaction): Promise<any> {
    if (!sourceInstance || !addFunctionName || !id || !model) {
      throw new Error("Parâmetros faltando para a função");
    }

    const entity: any = await (model as any).findByPk(id, { attributes: { exclude: ["createdAt", "updatedAt", "event_invitee"] } });

    if (!entity) {
      throw new Error("Entidade não encontrada");
    }

    await sourceInstance[addFunctionName](entity, { transaction: t });

    return entity.dataValues;
  }
}

export default new EventInviteeService();
