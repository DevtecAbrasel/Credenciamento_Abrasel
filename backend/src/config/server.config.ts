import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";

import router from "#routes/router.js";
import { exceptionHandler } from "#middlewares/exception-handler.middleware.js";

config(); // Inicializando .env

// Opções dos middlewares
const limiter: any = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 600, // máximo 600 requisições (1r/s)
});

const corsOptions: cors.CorsOptions = {
  origin: "*",
};

const server: express.Express = express();

// Middlewares
server.use(express.json());
server.use(morgan("common"));
server.use(helmet());
server.use(cors(corsOptions));
server.use(limiter);

server.use("/v1", router);

server.use(exceptionHandler);

export default server;
