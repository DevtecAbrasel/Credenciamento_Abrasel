import { Router } from "express";

import { authorization } from "#middlewares/auth.middleware.js";
import authRouter from "#routes/auth.route.js";
import userRouter from "#routes/manager.route.js";

const router = Router();

const enviroment = process.env.ENVIRONMENT;
const shouldAuth = (!!enviroment && enviroment.trim() == "development") ? [] : [authorization];

router.use("/auth", authRouter);

router.use("/manager", shouldAuth, userRouter);

export default router;
