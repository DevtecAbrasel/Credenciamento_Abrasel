import jwt from "jsonwebtoken";
import { comparePassword } from "#utils/password.utils.js";
import ManagerService from "#services/manager.service.js";
import recepcionistService from "./recepcionist.service.js";

class AuthService {
  public async authenticate(login: any): Promise<string | null> {
    let user, identifier = null;
    
    if(!!login.email) {
      user = await ManagerService.findByField("email", login.email, true);
      identifier = { email: login.email };
    } else if (!!login.cellphone) {
      user = await recepcionistService.findByField("cellphone", login.cellphone, true);
      identifier = { cellphone: login.cellphone };
    }
    
    if (!user) {
      return null;
    }

    if (!comparePassword(login.password, user.password!)) {
      return null;
    }

    return jwt.sign({ user: { name: user.name, ...identifier } }, process.env.SECRET_KEY, {
      audience: "credenciamento",
      expiresIn: "3h",
    });
  }
}

export default new AuthService();
