import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import eventService from "#services/event.service.js";
import { Router } from "express";
import { Transaction } from "sequelize";

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
      msg: "Evento criado com sucesso",
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
      msg: "Evento atualizado com sucesso",
      event,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const eventParams = req.body;
    const event = await eventService.deleteById(eventParams?.id, t);
    res.status(200).send({
      msg: "Evento deletado com sucesso",
      ...event,
    });
  })
);

router.post(
  "/addInvitee",
  asyncWrapper(async (req: any, res: any) => {
    const reqParams = req.body;
    const event = await eventService.addInvitee(reqParams.eventId, reqParams.inviteeId, reqParams.inviteeEmail);
    res.status(200).send({
      msg: "Convidado adicionado ao evento com sucesso",
      event,
    });
  })
);

router.post(
  "/removeInvitee",
  composedWrapper(async (req: any, res: any) => {
    const reqParams = req.body;
    const event = await eventService.removeInvitee(reqParams.eventId, reqParams.inviteeId, reqParams.inviteeEmail);
    res.status(200).send({
      msg: "Convidado removido do evento com sucesso",
      event,
    });
  })
);

export default router;