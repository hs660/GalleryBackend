import { Router } from "express";
import { loginAdmin,getDashboard,uploadImage,getAllImages,deleteImage,updateImage,toggleLikeImage } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.post("/login", loginAdmin);
router.get("/dashboard", verifyJWT, getDashboard);
router.post(
  "/upload-image",
  verifyJWT,
  upload.single("image"),
  uploadImage
);
router.get("/images", verifyJWT, getAllImages);
router.delete("/image/:id", verifyJWT, deleteImage);
router.put(
  "/image/:id",
  verifyJWT,
  upload.single("image"),
  updateImage
);
router.post(
  "/image/like/:imageId",
 // verifyUserJWT,  // Firebase login ke baad wala middleware
  toggleLikeImage
);

export default router;