import mongoose,{Schema} from "mongoose";


const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    picture: String,

    likedImages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("User", userSchema);

