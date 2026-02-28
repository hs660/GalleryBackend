import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "../src/app.js";

dotenv.config({
  path: "./.env"
});

connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
  });
});
/*
import mongoose from "mongoose"
;( async() => {
  try {
     await  mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     app.on("error", (error) => {
      console.log("Error: ",error);
      throw error
     })
  } catch (error) {
    console.error("Error:", error)
    throw err
  }
})() */

