import { Router } from "express";
import { verifyUser,optionalVerifyUser } from "../controllers/image.controller.js"; // Firebase middleware
import { getAllImages, toggleLike, getLikedImages ,uploadImage} from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.get("/",optionalVerifyUser, getAllImages);
router.post("/like/:imageId", verifyUser, toggleLike);
router.get("/liked", verifyUser, getLikedImages);
router.post("/upload", 
    upload.single("image"), 
    uploadImage);
// router.post(
//   "/upload-image",
//   verifyUser,
//   upload.single("image"),
//   uploadImage
// );
export default router;