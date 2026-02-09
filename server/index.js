import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./db/db.js";
import fileRouter from "./routes/file.route.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://web-editor-one.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);


connectDB();

app.use("/file", fileRouter);
app.use("/user", userRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://web-editor-one.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  },
});

const sessions = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-session", ({ sessionId, user }) => {
    if (!sessionId || !user?.username) return;

    socket.join(sessionId);
    socket.sessionId = sessionId;

    if (!sessions[sessionId]) {
      sessions[sessionId] = {};
    }

    sessions[sessionId][socket.id] = {
      username: user.username,
    };

    io.to(sessionId).emit("live-users", sessions[sessionId]);

    console.log(
      `User ${user.username} joined session ${sessionId}`
    );
  });


  socket.on("cursor-move", (data) => {
    const { fileId, position } = data;
    const sessionId = socket.sessionId;

    if (!sessionId) return;

    const user = sessions[sessionId]?.[socket.id];
    if (!user) return;

    socket.to(sessionId).emit("client-cursor", {
      fileId,
      position,
      sender: socket.id,
      username: user.username,
    });
  });

  socket.on("edits", (data) => {
    const { fileId, changes } = data;
    const sessionId = socket.sessionId;

    if (!sessionId) return;

    
    socket.to(sessionId).emit("client-edits", {
      fileId,
      changes,
      sender: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const sessionId = socket.sessionId;

    if (sessionId && sessions[sessionId]) {
      delete sessions[sessionId][socket.id];

      
      if (Object.keys(sessions[sessionId]).length === 0) {
        delete sessions[sessionId];
      } else {
        io.to(sessionId).emit(
          "live-users",
          sessions[sessionId]
        );
      }
    }

    console.log("Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log("Server running on PORT:", PORT);
});
