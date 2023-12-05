import { Router } from "express";
import { Transaction } from "sequelize";
import { asyncWrapper } from "#middlewares/async-wrapper.middleware.js";
import { composedWrapper } from "#middlewares/wrapper-composer.middleware.js";
import inviteeService from "#services/invitee.service.js";

const router = Router();

router.get(
  "/",
  asyncWrapper(async (_: unknown, res: any) => {
    const invitees = await inviteeService.findAll();
    res.status(200).send(invitees);
  })
);

router.post(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const inviteeParams = req.body;
    const invitee = await inviteeService.create(inviteeParams, t);
    res.status(200).send({
      msg: "Convidado criado com sucesso",
      invitee,
    });
  })
);

router.put(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const inviteeParams = req.body;
    const invitee = await inviteeService.update(inviteeParams, t);
    res.status(200).send({
      msg: "Convidado atualizado com sucesso",
      invitee,
    });
  })
);

router.delete(
  "/",
  composedWrapper(async (req: any, res: any, t: Transaction) => {
    const inviteeParams = req.body;
    const invitee = await inviteeService.deleteById(inviteeParams?.id, t);
    res.status(200).send({
      msg: "Convidado deletado com sucesso",
      ...invitee,
    });
  })
);

router.post(
  "/addEvent",
  asyncWrapper(async (req: any, res: any) => {
    const reqParams = req.body;
    const invitee = await inviteeService.addEvent(reqParams.eventId, reqParams.inviteeId, reqParams.inviteeEmail);
    res.status(200).send({
      msg: "Convidado adicionado ao evento com sucesso",
      invitee,
    });
  })
);

router.post(
  "/removeEvent",
  composedWrapper(async (req: any, res: any) => {
    const reqParams = req.body;
    const invitee = await inviteeService.removeEvent(reqParams.eventId, reqParams.inviteeId, reqParams.inviteeEmail);
    res.status(200).send({
      msg: "Convidado removido do evento com sucesso",
      invitee
    });
  })
);

export default router;
