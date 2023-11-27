import { Router } from "express";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import authService from "#services/auth.service.js";

const router = Router();

router.post(
  "/login",
  asyncWrapper(async (req: any, res: any) => {
    const login = req.body;

    let token: string | null = await authService.authenticate(login);

    let status = 200;

    if (!token) {
      status = 401;
      token = "Erro de autenticação.";
    }

    return res.status(status).send({
      msg: token,
    });
  })
);

export default router;
