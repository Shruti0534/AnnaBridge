import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/users.route.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow from any origin for dev
  },
});

// --- Signaling logic ---
let connections = {}; // { roomId: [socketId, ...] }

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  socket.on("join-call", (roomId) => {
    socket.join(roomId);
    if (!connections[roomId]) {
      connections[roomId] = [];
    }

    connections[roomId].push(socket.id);

    console.log(`🔗 User ${socket.id} joined room ${roomId}`);
    console.log(`Room ${roomId} members:`, connections[roomId]);

    // Notify the new user about existing users
    connections[roomId].forEach((existingSocketId) => {
      if (existingSocketId === socket.id) return;
      io.to(socket.id).emit("user-joined", existingSocketId, connections[roomId]);
    });

    // Notify existing users about the new user
    connections[roomId].forEach((existingSocketId) => {
      if (existingSocketId === socket.id) return;
      io.to(existingSocketId).emit("user-joined", socket.id, connections[roomId]);
    });
  });

  socket.on("signal", (toId, message) => {
    console.log(`📡 Relaying signal from ${socket.id} to ${toId}`);
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("chat-message", (message, sender) => {
    console.log(`💬 Chat message: ${message} from ${sender}`);
    // Send to all users in all rooms this socket is in
    for (const roomId in connections) {
      if (connections[roomId].includes(socket.id)) {
        connections[roomId].forEach((otherId) => {
          if (otherId !== socket.id) {
            io.to(otherId).emit("chat-message", message, sender, socket.id);
          }
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    for (const roomId in connections) {
      connections[roomId] = connections[roomId].filter((id) => id !== socket.id);
      // Notify remaining users
      connections[roomId].forEach((otherId) => {
        io.to(otherId).emit("user-left", socket.id);
      });
      if (connections[roomId].length === 0) {
        delete connections[roomId];
      }
    }
  });
});

// --- Express app config ---
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

// --- MongoDB ---
const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shrutit515:Shrutit8090@cluster0.ywy4396.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

start();


