import { Router } from "express";
import { verifyUser,optionalVerifyUser } from "../controllers/image.controller.js"; // Firebase middleware
import { getAllImages, toggleLike, getLikedImages } from "../controllers/image.controller.js";

const router = Router();

router.get("/",optionalVerifyUser, getAllImages);
router.post("/like/:imageId", verifyUser, toggleLike);
router.get("/liked", verifyUser, getLikedImages);

export default router;