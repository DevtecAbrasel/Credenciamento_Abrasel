import { CreationAttributes, Transaction } from "sequelize";

import { Recepcionist, RecepcionistDTO } from "#interfaces/recepcionist.interface.js";
import { RecepcionistModel } from "#models/recepcionist.model.js";
import { generateRandomPassword, hashPassword } from "#utils/password.utils.js";
import { isNumeric } from "#utils/string.util.js";
import { EventModel } from "#models/event.model.js";

class ManagerService {
  // GET
  public async findAll(): Promise<RecepcionistDTO[]> {
    const recepcionist: RecepcionistDTO[] = await RecepcionistModel.findAll({
      attributes: { exclude: ["eventId", "password", "createdAt", "updatedAt"] },
      include: [
        {
          model: EventModel,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return recepcionist;
  }

  public async findById(id: number, returnPassword: boolean = false): Promise<RecepcionistDTO | null> {
    let excludeAttrs = ["eventId", "createdAt", "updatedAt"];
    if (!returnPassword) excludeAttrs.push("password");
    const recepcionist: RecepcionistDTO | null = await RecepcionistModel.findOne({
      where: { id: id },
      attributes: {
        exclude: excludeAttrs,
      },
      include: [
        {
          model: EventModel,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return recepcionist;
  }

  public async findByFields(whereValues: object, returnPassword: boolean = false): Promise<Array<RecepcionistDTO> | null> {
    let excludeAttrs = ["eventId", "createdAt", "updatedAt"];
    if (!returnPassword) excludeAttrs.push("password");
    const recepcionist: Array<RecepcionistDTO> | null = await RecepcionistModel.findAll({
      where: { ...whereValues },
      attributes: {
        exclude: excludeAttrs,
      },
      include: [
        {
          model: EventModel,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });
    return recepcionist;
  }

  // POST
  public async create(recepcionistParams: Recepcionist, t?: Transaction): Promise<RecepcionistDTO> {
    let recepcionistParamsNoId: CreationAttributes<Recepcionist> = (({ id: _, ...rest }) => ({
      ...rest,
    }))(recepcionistParams);

    const randomPassword = generateRandomPassword(10);
    recepcionistParamsNoId.password = hashPassword(randomPassword);

    const recepcionist: RecepcionistDTO = (
      await RecepcionistModel.create(recepcionistParamsNoId, {
        transaction: t,
      })
    ).dataValues;

    const { password: _, ...recepcionistFiltered } = recepcionist;

    return recepcionistFiltered;
  }

  // PUT
  public async update(recepcionistParams: Recepcionist, t?: Transaction): Promise<RecepcionistDTO> {
    let recepcionistParamsNoPassword: CreationAttributes<Recepcionist> = (({ password: _, ...rest }) => ({
      ...rest,
    }))(recepcionistParams);

    // Validação do update
    if (!recepcionistParamsNoPassword.id) {
      throw new Error("A requisição não possui o id do recepcionista.");
    }

    const recepcionistFound = await this.findById(recepcionistParamsNoPassword.id);

    if (!recepcionistFound) {
      throw new Error("O recepcionista não foi encontrado.");
    }

    if (
      recepcionistParamsNoPassword.cellphone !== recepcionistFound.cellphone ||
      recepcionistParamsNoPassword.event !== recepcionistFound.event
    ) {
      let parameters = {
        cellphone: recepcionistParamsNoPassword.cellphone ? recepcionistParamsNoPassword.cellphone : recepcionistFound.cellphone,
        event: recepcionistParamsNoPassword.event ? recepcionistParamsNoPassword.event : recepcionistFound.event,
      };

      const recepcionistSameKeys = await this.findByFields(parameters);

      if (recepcionistSameKeys?.length && recepcionistSameKeys.length > 0) {
        throw new Error("Recepcionista com par de celular e evento já existe.");
      }
    }

    const [count] = await RecepcionistModel.update(recepcionistParamsNoPassword, {
      where: { id: recepcionistParamsNoPassword.id },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Erro na atualização do recepcionista!");
    }

    return {
      id: recepcionistParamsNoPassword.id,
      name: recepcionistParamsNoPassword.name,
      cellphone: recepcionistParamsNoPassword.cellphone,
      eventId: recepcionistParamsNoPassword.eventId,
    };
  }

  public async deleteById(id: number, t?: Transaction): Promise<RecepcionistDTO> {
    console.log(id);
    if (!id) {
      throw new Error("Não foi enviado o id do recepcionista!");
    }

    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const recepcionist = await Recepcionist.findByPk(id);
    const count = await RecepcionistModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("O recepcionista não existe");
    }

    return { id: recepcionist!.id, cellphone: recepcionist!.cellphone, eventId: recepcionist!.eventId };
  }
}

export default new ManagerService();
