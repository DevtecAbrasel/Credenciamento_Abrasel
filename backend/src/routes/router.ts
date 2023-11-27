import { Router } from "express";

import { authorization } from "../middlewares/auth.middleware.js";
import authRouter from "./auth.route.js";
import userRouter from "./manager.route.js";

const router = Router();

const shouldAuth = process.env.ENVIRONMENT == "development" ? [] : [authorization];

router.use("/auth", authRouter);

router.use("/manager", shouldAuth, userRouter);

export default router;
