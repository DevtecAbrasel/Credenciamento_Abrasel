import { Router } from "express";
import { Transaction } from "sequelize";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import recepcionistService from "#services/recepcionist.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const recepcionists = await recepcionistService.findAll();
    res.status(200).send(recepcionists);
  })
);

router.post(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const recepcionistParams = req.body;
    const recepcionist = await recepcionistService.create(recepcionistParams, t);
    res.status(200).send({
      msg: "Recepicionista criado com sucesso",
      recepcionist,
    });
  })
);

router.put(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const recepcionistParams = req.body;
    const recepcionist = await recepcionistService.update(recepcionistParams, t);
    res.status(200).send({
      msg: "Recepicionista atualizado com sucesso",
      recepcionist,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const recepcionistParams = req.body;
    const id = !!recepcionistParams?.id ? recepcionistParams.id : recepcionistParams;
    const email = await recepcionistService.deleteById(id, t);
    res.status(200).send({
      msg: "Recepicionista deletado com sucesso",
      email,
    });
  })
);

export default router;
