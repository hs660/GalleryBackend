import { Router } from "express";
import { loginAdmin,getDashboard,uploadImage,getAllImages,deleteImage,updateImage,toggleLikeImage,getAdminStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
import imageModel from "../models/image.model.js";
import userModel from "../models/user.model.js";

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
router.get("/debug-db", async (req, res) => {
  try {
    const users = await userModel.find();
    const images = await userModel.find();

    res.json({
      usersCount: users.length,
      imagesCount: images.length,
      users,
      images,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/stats", verifyJWT, getAdminStats);

export default router;