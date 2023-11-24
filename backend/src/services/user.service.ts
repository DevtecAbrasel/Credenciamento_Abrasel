import { CreationAttributes } from "sequelize";

import { User, UserDTO } from "../interfaces/user.interface.js";
import { UserModel } from "../models/user.model.js";
import { hashPassword } from "../utils/password.utils.js";

class UserService {
  // GET
  public async findAll(): Promise<UserDTO[]> {
    const user: UserDTO[] = await UserModel.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return user;
  }

  public async findById(id: number, returnPassword: boolean = false): Promise<UserDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const user: UserDTO | null = await UserModel.findOne({ where: { id: id }, ...attrPassword });
    return user;
  }

  public async findByField(field: string, value: any, returnPassword: boolean = false): Promise<UserDTO | null> {
    const attrPassword = returnPassword ? {} : { attributes: { exclude: ["password"] } };
    const user: UserDTO | null = await UserModel.findOne({ where: { [field]: value }, ...attrPassword });
    return user;
  }

  // POST
  public async create(userParams: Omit<User, "id">): Promise<UserDTO> {
    let userParamsNoId: CreationAttributes<User> = (({ name, email, password }) => ({
      name,
      email,
      password,
    }))(userParams);

    userParamsNoId.password = hashPassword(userParamsNoId.password);
    const user: User = await UserModel.create(userParamsNoId);
    return { id: user.id, name: user.name, email: user.email };
  }

  // PUT
  public async update(userParams: User): Promise<UserDTO> {
    let userParamsNoPassword: CreationAttributes<User> = (({ password: _, ...rest }) => ({
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

    if (userParamsNoPassword.email !== userFound.email) {
      const userSameEmail = await this.findByField("email", userParamsNoPassword.email);

      if (userSameEmail) {
        throw new Error("Email já existe.");
      }
    }

    const [count] = await UserModel.update(userParamsNoPassword, { where: { id: userParamsNoPassword.id } });

    if (count != 1) {
      throw new Error("Erro no update!");
    }

    return { id: userParamsNoPassword.id, name: userParamsNoPassword.name, email: userParamsNoPassword.email };
  }

  public async deleteById(id: number): Promise<number> {
    const count = await UserModel.destroy({ where: { id }});

    if(count == 0) {
      throw new Error("Usuário não existe");
    } 

    return count;
  }
}

export default new UserService();
