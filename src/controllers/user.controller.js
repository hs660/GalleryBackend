import admin from "../config/firebaseAdmin.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // 1️⃣ Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decodedToken;

    // 2️⃣ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        picture
      });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};