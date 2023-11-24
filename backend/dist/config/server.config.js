import { config } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
config(); // carregar arquivo .env
// Opções dos middlewares
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 600 // máximo 600 requisições (1r/s)
});
const corsOptions = {
    origin: "*"
};
const server = express();
// Middlewares
server.use(morgan("common"));
server.use(helmet());
server.use(cors(corsOptions));
server.use(limiter);
export default server;
//# sourceMappingURL=server.config.js.map