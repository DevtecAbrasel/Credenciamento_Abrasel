import { Router } from "express";
import { Transaction } from "sequelize";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import managerService from "#services/manager.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const users = await managerService.findAll();
    res.status(200).send(users);
  })
);

router.post(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const userParams = req.body;
    const user = await managerService.create(userParams, t);
    res.status(200).send({
      msg: "Usuário criado com sucesso",
      user,
    });
  })
);

router.put(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const userParams = req.body;
    const user = await managerService.update(userParams, t);
    res.status(200).send({
      msg: "Usuário atualizado com sucesso",
      user,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const userParams = req.body;
    const id = (!!userParams?.id)? userParams.id : userParams;
    const email = await managerService.deleteById(id, t);
    res.status(200).send({
      msg: "Usuário deletado com sucesso",
      email,
    });
  })
);

export default router;
