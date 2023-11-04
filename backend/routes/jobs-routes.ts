import { Router } from "express";
import pgrkamRoutes from "./jobs/pgrkam-routes";
import jkkRoutes from "./jobs/jkk-routes";
import authMiddleware from "../middlewares/auth-middleware";

const router = Router();

router.use(authMiddleware);

router.use('/pgrkam', pgrkamRoutes);
router.use('/jkk', jkkRoutes);


export default router;
