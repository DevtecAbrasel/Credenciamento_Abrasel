import { Router } from "express";

import { authorization } from "#middlewares/auth.middleware.js";
import authRouter from "#routes/auth.route.js";
import managerRouter from "#routes/manager.route.js";
import recepcionistRouter from "#routes/recepcionist.route.js";

const router = Router();

const enviroment = process.env.ENVIRONMENT;
const shouldAuth = (!!enviroment && enviroment.trim() == "development") ? [] : [authorization];

router.use("/auth", authRouter);

router.use("/manager", shouldAuth, managerRouter);
router.use("/recepcionist", shouldAuth, recepcionistRouter);

export default router;
