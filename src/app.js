import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRouter from  "../src/routes/admin.routes.js";
import userRouter from "../src/routes/user.rotes.js"
import imageRouter from "../src/routes/image.route.js"

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
))

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