import { Router } from "express";
import { Transaction } from "sequelize";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import managerService from "#services/manager.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const managers = await managerService.findAll();
    res.status(200).send(managers);
  })
);

router.post(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const managerParams = req.body;
    const manager = await managerService.create(managerParams, t);
    res.status(200).send({
      msg: "Genrente criado com sucesso",
      manager,
    });
  })
);

router.put(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const managerParams = req.body;
    const manager = await managerService.update(managerParams, t);
    res.status(200).send({
      msg: "Genrente atualizado com sucesso",
      manager,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const managerParams = req.body;
    const id = (!!managerParams?.id)? managerParams.id : managerParams;
    const email = await managerService.deleteById(id, t);
    res.status(200).send({
      msg: "Genrente deletado com sucesso",
      email,
    });
  })
);

export default router;
