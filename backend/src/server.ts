import server from "./config/server.config.js";
import { connectDatabase } from "./databases/init.db.js";
import { stringToNumber } from "./utils/string.util.js";

const PORT: string = process.env.PORT || "8080";
const HOST: string = process.env.HOST || "localhost";

// Conectar ao banco
connectDatabase();

server.listen(stringToNumber(PORT), HOST, () => {
    console.log(`Server listening on address http://${HOST}:${PORT}`);
});