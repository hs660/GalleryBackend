import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import Image from "../models/image.model.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";


import fs from "fs";

export const loginAdmin = asyncHandler(async (req,res) => {
    console.log(req.body);
    const { email, password } = req.body;

    if(!email || !password){
        throw new ApiError(400,"Email and Password required");
    }

    const admin = await Admin.findOne({ email });

    if(!admin){
        throw new ApiError(401,"Invalid Credentials");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid Credentials");
    }

    const accessToken = admin.generateAccessToken();

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            admin,
            accessToken
        },"Login Successful")
    )
});

export const getDashboard = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Admin Dashboard 🚀",
    admin: req.admin
  });
};

export const uploadImage = async (req, res) => {
  try {
    const localPath = req.file?.path;
    const { title,tags } = req.body;

console.log("TAG RECEIVED:", title,tags);
    if (!localPath || !title) {
      return res.status(400).json({
        message: "Title and Image are required",
      });
    }
    const cloudinaryResponse = await uploadCloudinary(localPath);

    const newImage = await Image.create({
      title,
      tags,
      imageUrl: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
      uploadedBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      data: newImage,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Delete from DB
    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateImageTitle = async (req, res) => {
  try {
    const { title } = req.body;

    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags } = req.body;   // ✅ TAG ADD

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // ✅ Title update
    if (title) {
      image.title = title;
    }

    // ✅ Tag update (IMPORTANT)
    if (tags !== undefined) {
      image.tags = tags;   // string case
    }

    // ✅ Image update
    if (req.file) {
      if (image.public_id) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });

      image.imageUrl = result.secure_url;
      image.public_id = result.public_id;
    }

    await image.save();

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: image,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const toggleLikeImage = async (req, res) => {
  try {
    const userId = req.user._id; // Firebase JWT se aayega
    const { imageId } = req.params;

    const user = await User.findById(userId);
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const alreadyLiked = user.likedImages.includes(imageId);

    if (alreadyLiked) {
      // Unlike
      user.likedImages.pull(imageId);
      image.likes -= 1;
    } else {
      // Like
      user.likedImages.push(imageId);
      image.likes += 1;
    }

    await user.save();
    await image.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: image.likes,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    // Total Images
    const totalImages = await Image.countDocuments();

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Likes (sum of all images)
    const totalLikesData = await Image.aggregate([
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likesCount" }
        }
      }
    ]);

    const totalLikes = totalLikesData[0]?.totalLikes || 0;

    // Most liked image
    const mostLiked = await Image.findOne().sort({ likesCount: -1 });

    res.status(200).json({
      success: true,
      data: {
        totalImages,
        totalUsers,
        totalLikes,
        mostLiked,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};