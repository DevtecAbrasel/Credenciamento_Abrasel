import { Router } from "express";
import { asyncWrapper } from "../middlewares/async-wrapper.middleware.js";
import UserService from "../services/user.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const users = await UserService.findAll();
    res.status(200).send(users);
  })
);

router.post(
  "/",
  asyncWrapper(async (req: any, res: any) => {
    const userParams = req.body;
    const user = await UserService.create(userParams);
    res.status(200).send({
      msg: "Usuário criado com sucesso",
      user,
    });
  })
);

router.put(
  "/",
  asyncWrapper(async (req: any, res: any) => {
    const userParams = req.body;
    const user = await UserService.update(userParams);
    res.status(200).send({
      msg: "Usuário atualizado com sucesso",
      user,
    });
  })
);

router.delete(
  "/",
  asyncWrapper(async (req: any, res: any) => {
    const userParams = req.body;
    const quantity = await UserService.deleteById(userParams);
    res.status(200).send({
      msg: "Usuário deletado com sucesso",
      quantidade: quantity,
    });
  })
);

export default router;
