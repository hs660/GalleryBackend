import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../src/models/admin.model.js";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: "./.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    console.log("Connected to:", DB_NAME);

    const existingAdmin = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    await Admin.create({
      email: "admin@gmail.com",
      password: "Admin@123",
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();