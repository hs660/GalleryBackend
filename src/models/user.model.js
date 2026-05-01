import mongoose,{Schema} from "mongoose";
 const userSchema = new Schema({
  uid: {
    type: String,
    unique: true,
    required: true
  },
  name: String,
  email: String,
  picture: String,

  likedImages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image"
    }
  ]
});

export default mongoose.model("User",userSchema)