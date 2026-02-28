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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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