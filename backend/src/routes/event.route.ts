import { Router } from "express";
import { Transaction } from "sequelize";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import eventService from "#services/event.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const events = await eventService.findAll();
    res.status(200).send(events);
  })
);

router.post(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const eventParams = req.body;
    const event = await eventService.create(eventParams, t);
    res.status(200).send({
      msg: "Recepicionista criado com sucesso",
      event,
    });
  })
);

router.put(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const eventParams = req.body;
    const event = await eventService.update(eventParams, t);
    res.status(200).send({
      msg: "Recepicionista atualizado com sucesso",
      event,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const eventParams = req.body;;
    const event = await eventService.deleteById(eventParams?.id, t);
    res.status(200).send({
      msg: "Recepicionista deletado com sucesso",
      ...event,
    });
  })
);

export default router;
