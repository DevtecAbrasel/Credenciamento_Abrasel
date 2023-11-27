import { CreationAttributes, Transaction } from "sequelize";

import { Manager, ManagerDTO } from "#interfaces/manager.interface.js";
import { ManagerModel } from "#models/manager.model.js";
import { hashPassword } from "#utils/password.utils.js";
import { isNumeric } from "#utils/string.util.js";

class ManagerService {
  // GET
  public async findAll(): Promise<ManagerDTO[]> {
    const user: ManagerDTO[] = await ManagerModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return user;
  }

  public async findById(id: number, returnPassword: boolean = false): Promise<ManagerDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const user: ManagerDTO | null = await ManagerModel.findOne({ where: { id: id }, ...attrPassword });
    return user;
  }

  public async findByField(
    field: string,
    value: any,
    returnPassword: boolean = false
  ): Promise<ManagerDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const user: ManagerDTO | null = await ManagerModel.findOne({ where: { [field]: value }, ...attrPassword });
    return user;
  }

  // POST
  public async create(userParams: Manager, t?: Transaction): Promise<ManagerDTO> {
    let userParamsNoId: CreationAttributes<Manager> = (({ id: _, ...rest }) => ({
      ...rest,
    }))(userParams);

    userParamsNoId.password = hashPassword(userParamsNoId.password);
    const user: Manager = await ManagerModel.create(userParamsNoId, { transaction: t });
    return { id: user.id, name: user.name, email: user.email, origin: user.origin };
  }

  // PUT
  public async update(userParams: Manager, t?: Transaction): Promise<ManagerDTO> {
    let userParamsNoPassword: CreationAttributes<Manager> = (({ password: _, ...rest }) => ({
      ...rest,
    }))(userParams);

    // Validação do update
    if (!userParamsNoPassword.id) {
      throw new Error("O usuário não possuí id.");
    }

    const userFound = await this.findById(userParamsNoPassword.id);

    if (!userFound) {
      throw new Error("O usuário não foi encontrado.");
    }

    if (!!userParamsNoPassword.email && userParamsNoPassword.email !== userFound.email) {
      const userSameEmail = await this.findByField("email", userParamsNoPassword.email);

      if (userSameEmail) {
        throw new Error("Email já existe.");
      }
    }

    const [count] = await ManagerModel.update(userParamsNoPassword, {
      where: { id: userParamsNoPassword.id },
      transaction: t,
    });

    if (count != 1) {
      throw new Error("Erro no update!");
    }

    return {
      id: userParamsNoPassword.id,
      name: userParamsNoPassword.name,
      email: userParamsNoPassword.email,
      origin: userParamsNoPassword.origin,
    };
  }

  public async deleteById(id: number, t?: Transaction): Promise<string> {
    if (!isNumeric(id as any)) {
      throw new Error("O valor de id não é numérico!");
    }

    const user = await Manager.findByPk(id);
    const count = await ManagerModel.destroy({ where: { id }, transaction: t });

    if (count < 1) {
      throw new Error("Usuário não existe");
    }

    return user!.email;
  }
}

export default new ManagerService();
