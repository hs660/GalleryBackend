import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const adminSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true})

// Hash Password
// adminSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// })
adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});
// Compare Password
adminSchema.methods.isPasswordCorrect = async function(password) {
   return await bcrypt.compare(password,this.password)
}

// Generate JWT
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
        _id : this._id,
        email : this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

export const Admin = mongoose.model("Admin",adminSchema);