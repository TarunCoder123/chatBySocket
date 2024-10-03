import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/login", (req, res) => {
  res.send("Hello World");
});


io.on("connection", (socket) => {
  console.log("User Connected ", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    //  socket.broadcast.emit("receive-message",message);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    // console.log(`User joined the ${room}`);
  });

  //    socket.emit("welcome","welcome to the server.");
  //    socket.broadcast.emit("welcome",`${socket.id} joined the server.`);

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
