import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String, // Firebase UID (admin + user)
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    tags: {
      type: String,
      default: "",
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: String, // Firebase uid of logged-in user
        required: true,
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Image", imageSchema);