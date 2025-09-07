import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: ['https://web-editor-one.vercel.app',"http://localhost:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(cookieParser());

connectDB();

import fileRouter from "./routes/file.route.js";
import userRouter from "./routes/user.routes.js"

app.use("/file",fileRouter);
app.use("/user",userRouter);

app.listen(PORT,() => {
    console.log("Server is running on PORT: ",PORT);
});