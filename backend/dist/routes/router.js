import { Router } from "express";
const router = Router();
router.get("/", (_, res) => {
    res.status(200).send("Hello world");
});
export default router;
//# sourceMappingURL=router.js.map