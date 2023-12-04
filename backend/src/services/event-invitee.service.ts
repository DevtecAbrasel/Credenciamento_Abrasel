import { Transaction } from "sequelize";

class EventInviteeService {
  public async add(sourceInstance: any, addFunctionName: string, id: number, model: any, t?: Transaction): Promise<any> {
    if (!sourceInstance || !addFunctionName || !id || !model) {
      throw new Error("Parâmetros faltando para a função");
    }

    // FIXME: verificar a possibilidade de consultar a tabela mxn para facilitar a query
    const alreadyExist = await (model as any).findAll({
      attributes: ["id"],
      where: { id },
      include: {
        model: sourceInstance.constructor,
        attributes: ["id"],
        where: { id: sourceInstance?.dataValues?.id },
        through: {
          attributes: [],
        },
      },
    });

    if(alreadyExist?.length > 0) {
      throw new Error("Convidado já adicionado ao evento!");
    }

    const entity: any = await (model as any).findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt", "event_invitee"] },
    });

    if (!entity) {
      throw new Error("Entidade não encontrada");
    }

    await sourceInstance[addFunctionName](entity, { transaction: t });

    return entity.dataValues;
  }
}

export default new EventInviteeService();
