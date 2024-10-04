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

const users={};

io.on("connection", (socket) => {
  console.log("User Connected ", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    if(!users[room]){
      users[room]=[];
    }
    users[room].push(socket.id);
    io.to(room).emit("active-users",users[room]);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    // BroadCast a message when someone leave the room
    io.emit("receive-message",{data: `${socket.id} left the room.`});
    for(const room in users){
      users[room]=users[room].filter((user)=>user!==socket.id);
      io.to(room).emit("active-users",users[room]);
    }
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
