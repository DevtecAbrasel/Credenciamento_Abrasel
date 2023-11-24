import jwt from "jsonwebtoken";

async function authorization(req: any, res: any, next: any): Promise<any> | never {
  // const token = req.cookies["SIGN_IN_COOKIE"];

  let bearerToken: string = req.headers["authorization"];

  const errorStatus: number = 401;
  const errorMsg: { msg: string } = { msg: "Você não tem permissão para acessar esse recurso." };

  if (!bearerToken) {
    return res.status(errorStatus).send(errorMsg);
  }

  try {
    const token: string | undefined = bearerToken.split(" ")[1];

    await jwt.verify(token!, process.env.SECRET_KEY!);

    // Realizar mais validações
    next();
  } catch (error) {
    return res.status(errorStatus).send(errorMsg);
  }
}

export { authorization };
