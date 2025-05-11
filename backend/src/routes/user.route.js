import { Router } from "express";
import saveUser from "../controllers/saveUser.js";
const router = Router();

router.post("/", saveUser);

export { router as userRouter };