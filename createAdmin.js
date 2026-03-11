import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import { DB_NAME } from "./src/constants.js";
import { Admin } from "./src/models/admin.model.js";   // apna admin model path

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MongoDB connected");

        const email = "ad@gmail.com";
        const password = "admin123";

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            email,
            password: hashedPassword,
        });

        await admin.save();

        console.log("Admin created successfully");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();