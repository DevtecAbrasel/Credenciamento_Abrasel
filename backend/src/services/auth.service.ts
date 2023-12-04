import jwt from "jsonwebtoken";
import { comparePassword } from "#utils/password.utils.js";
import ManagerService from "#services/manager.service.js";
import recepcionistService from "#services/recepcionist.service.js";

class AuthService {
  public async authenticate(login: any): Promise<string | null> {
    let user, identifier = null;
    
    if(!login.email && (!login.cellphone || !login.event)) {
      throw new Error("Estão faltando credenciais!");
    }

    if(!!login.email) {
      user = await ManagerService.findByFields({ email: login.email }, true);
      identifier = { email: login.email };
    } else if (!!login.cellphone) {
      user = await recepcionistService.findByFields({ cellphone: login.cellphone, event: login.event }, true);
      identifier = { cellphone: login.cellphone };
    }
    
    if (!user || user.length == 0) {
      return null;
    }

    if (!comparePassword(login.password, user[0]!.password!)) {
      return null;
    }

    return jwt.sign({ user: { name: user[0]!.name, ...identifier } }, process.env.SECRET_KEY, {
      audience: "credenciamento",
      expiresIn: "3h",
    });
  }
}

export default new AuthService();
