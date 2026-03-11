import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRouter from  "../src/routes/admin.routes.js";
import userRouter from "../src/routes/user.rotes.js"
import imageRouter from "../src/routes/image.route.js"

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://website-user-three.vercel.app"
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/images", imageRouter);


app.get("/",(req,res) => {
    res.send("Server Running")
})
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

export default app;