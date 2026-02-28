import { Router } from "express";
import { firebaseLogin } from "../controllers/user.controller.js";

const router = Router();

router.post("/login", firebaseLogin);

export default router;