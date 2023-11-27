import { CreationAttributes, Transaction } from "sequelize";

import { Recepcionist, RecepcionistDTO } from "#interfaces/recepcionist.interface.js";
import { RecepcionistModel } from "#models/recepcionist.model.js";
import { generateRandomPassword, hashPassword } from "#utils/password.utils.js";
import { isNumeric } from "#utils/string.util.js";

class ManagerService {
  // GET
  public async findAll(): Promise<RecepcionistDTO[]> {
    const recepcionist: RecepcionistDTO[] = await RecepcionistModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return recepcionist;
  }

  public async findById(id: number, returnPassword: boolean = false): Promise<RecepcionistDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const recepcionist: RecepcionistDTO | null = await RecepcionistModel.findOne({
      where: { id: id },
      ...attrPassword,
    });
    return recepcionist;
  }

  public async findByField(
    field: string,
    value: any,
    returnPassword: boolean = false
  ): Promise<RecepcionistDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const recepcionist: RecepcionistDTO | null = await RecepcionistModel.findOne({
      where: { [field]: value },
      ...attrPassword,
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

    const recepcionist: Recepcionist = await RecepcionistModel.create(recepcionistParamsNoId, { transaction: t });

    return { id: recepcionist.id, name: recepcionist.name, cellphone: recepcionist.cellphone, password: randomPassword };
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
    };
  }

  public async deleteById(id: number, t?: Transaction): Promise<string> {
    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const recepcionist = await Recepcionist.findByPk(id);
    const count = await RecepcionistModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("O recepcionista não existe");
    }

    return recepcionist!.cellphone;
  }
}

export default new ManagerService();
