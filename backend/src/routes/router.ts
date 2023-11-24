import { Router } from "express";

import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import { asyncWrapper } from "../middlewares/async-wrapper.middleware.js";
import { authorization } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", [authorization], userRouter);

router.get(
  "/",
  [authorization],
  asyncWrapper(async (_: unknown, res: any) => {
    res.status(200).send("Hello world");
  })
);

export default router;
