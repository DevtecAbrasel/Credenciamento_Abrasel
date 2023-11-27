import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/password.utils.js";
import UserService from "./manager.service.js";

class AuthService {
  public async authenticate(login: any): Promise<string | null> {
    const user = await UserService.findByField("email", login.email, true);

    if (!user) {
      return null;
    }

    if (!comparePassword(login.password, user.password!)) {
      return null;
    }

    return jwt.sign({ user: { name: user.name, email: user.email } }, process.env.SECRET_KEY, {
      audience: "credenciamento",
      expiresIn: "3h",
    });
  }
}

export default new AuthService();
