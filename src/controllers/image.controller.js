import Image from "../models/image.model.js";
import admin from "../config/firebaseAdmin.js";


export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded User:", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
};


// Get All Images
// Get All Images with Sorting
export const getAllImages = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = {};

    if (sort === "oldest") {
      sortOption = { createdAt: 1 }; // Ascending
    } else if (sort === "popular") {
      sortOption = { likesCount: -1 }; // Most likes first
    } else {
      // Default → newest
      sortOption = { createdAt: -1 };
    }

    const images = await Image.find().sort(sortOption);

    res.json(images);

  } catch (error) {
    console.error("Get All Images Error:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
};

// Like / Unlike Image
export const toggleLike = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.uid; // Firebase UID

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (!image.likedBy) image.likedBy = [];

    const alreadyLiked = image.likedBy.includes(userId);

    if (alreadyLiked) {
      image.likesCount -= 1;
      image.likedBy = image.likedBy.filter(uid => uid !== userId);
    } else {
      image.likesCount += 1;
      image.likedBy.push(userId);
    }

    await image.save();

    res.json({ 
      message: alreadyLiked ? "Unliked" : "Liked", 
      likesCount: image.likesCount 
    });

  } catch (error) {
    console.error("Toggle Like Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Liked Images by User
export const getLikedImages = async (req, res) => {
  try {
    const userId = req.user.uid;
    const images = await Image.find({ likedBy: userId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    console.error("Get Liked Images Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};