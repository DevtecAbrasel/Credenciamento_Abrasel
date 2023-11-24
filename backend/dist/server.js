import server from "./config/server.config.js";
import { stringToNumber } from "./utils/string.util.js";
import router from "./routes/router.js";
const PORT = process.env.PORT || "8080";
const HOST = process.env.HOST || "localhost";
server.use(router);
server.listen(stringToNumber(PORT), HOST, () => {
    console.log(`Server listening on address http://${HOST}:${PORT}`);
});
//# sourceMappingURL=server.js.map