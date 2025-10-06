import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cors from "cors";
import cookieParser from "cookie-parser"
import { Server}  from 'socket.io';
import { createServer } from "http"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [
    "https://web-editor-one.vercel.app",
    "http://localhost:5173",            
    "http://localhost:5174"             
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());

connectDB();

import fileRouter from "./routes/file.route.js";
import userRouter from "./routes/user.routes.js"

app.use("/file",fileRouter);
app.use("/user",userRouter);

const httpServer = createServer(app);

const io = new Server(httpServer,{
  cors: {
    origin: [
      "https://web-editor-one.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection",(socket) => {

  console.log('new client is connected',socket.id);

  socket.on('join-session',({sessionId}) => {
      socket.join(sessionId);
      socket.room = sessionId;
      console.log(`user ${socket.id} joined session: ${sessionId}`);
  });

  socket.on('edits',(res) => {
    if(socket.room){
      console.log("edits:",res);
       io.to(socket.room).emit('client-edit', {...res, sender: socket.id});
    }
  })

  socket.on('disconnect',() => {
    console.log('Client is disconnected!',socket.id);
  })

})

httpServer.listen(PORT,() => {
    console.log("Server is running on PORT: ",PORT);
});