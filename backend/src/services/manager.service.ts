import { CreationAttributes, Transaction } from "sequelize";

import { Manager, ManagerDTO } from "#interfaces/manager.interface.js";
import { ManagerModel } from "#models/manager.model.js";
import { hashPassword } from "#utils/password.utils.js";
import { isNumeric } from "#utils/string.util.js";

class ManagerService {
  // GET
  public async findAll(): Promise<ManagerDTO[]> {
    const manager: ManagerDTO[] = await ManagerModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return manager;
  }

  public async findById(id: number, returnPassword: boolean = false): Promise<ManagerDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const manager: ManagerDTO | null = await ManagerModel.findOne({ where: { id: id }, ...attrPassword });
    return manager;
  }

  public async findByField(
    field: string,
    value: any,
    returnPassword: boolean = false
  ): Promise<ManagerDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const manager: ManagerDTO | null = await ManagerModel.findOne({ where: { [field]: value }, ...attrPassword });
    return manager;
  }

  // POST
  public async create(managerParams: Manager, t?: Transaction): Promise<ManagerDTO> {
    let managerParamsNoId: CreationAttributes<Manager> = (({ id: _, ...rest }) => ({
      ...rest,
    }))(managerParams);

    managerParamsNoId.password = hashPassword(managerParamsNoId.password);
    const manager: Manager = await ManagerModel.create(managerParamsNoId, { transaction: t });
    return { id: manager.id, name: manager.name, email: manager.email, origin: manager.origin };
  }

  // PUT
  public async update(managerParams: Manager, t?: Transaction): Promise<ManagerDTO> {
    let managerParamsNoPassword: CreationAttributes<Manager> = (({ password: _, ...rest }) => ({
      ...rest,
    }))(managerParams);

    // Validação do update
    if (!managerParamsNoPassword.id) {
      throw new Error("A requisição não possuí o id do gerente.");
    }

    const managerFound = await this.findById(managerParamsNoPassword.id);

    if (!managerFound) {
      throw new Error("O gerente não foi encontrado.");
    }

    if (!!managerParamsNoPassword.email && managerParamsNoPassword.email !== managerFound.email) {
      const managerSameEmail = await this.findByField("email", managerParamsNoPassword.email);

      if (managerSameEmail) {
        throw new Error("Email já existe.");
      }
    }

    const [count] = await ManagerModel.update(managerParamsNoPassword, {
      where: { id: managerParamsNoPassword.id },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Erro na atualização do gerente!");
    }

    return {
      id: managerParamsNoPassword.id,
      name: managerParamsNoPassword.name,
      email: managerParamsNoPassword.email,
      origin: managerParamsNoPassword.origin,
    };
  }

  public async deleteById(id: number, t?: Transaction): Promise<string> {
    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const manager = await Manager.findByPk(id);
    const count = await ManagerModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("O gerente não existe");
    }

    return manager!.email;
  }
}

export default new ManagerService();
