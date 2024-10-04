import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  Stack,
  Paper,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [activeUsers,setActiveUsers]=useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    setRoom("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      handleSubmit(e);
    }
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", ({data}) => {
      setMessages((messages) => [...messages, data]);
    });

    socket.on("welcome", (m) => {
      console.log(m);
    });

    socket.on("active-users",(users)=>{
      setActiveUsers(users);
    });

    return () => {
      socket.disconnect(); //clean up function
    };
  }, [socket]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
      {/* Spacer for top margin */}
      <Box sx={{ height: 50 }} />

      {/* Welcome and Socket ID */}
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>
      <Typography variant="h6" component="div" gutterBottom>
        Your Socket ID: {socketID}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h3>Join Room</h3>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          onKeyDown={handleKeyDown}
          id="outlined-basic"
          label="Room name"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Join
        </Button>
      </form>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <h3>Message Box</h3>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          id="outlined-basic"
          label="Enter your message"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          onKeyDown={handleKeyDown}
          id="outlined-room"
          label="Room"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          Send
        </Button>
      </Box>

      {/* Messages Display */}
      <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Active Users in Room:
      </Typography>
      {activeUsers.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No users in the room.
        </Typography>
      ) : (
        activeUsers.map((user, i) => (
          <Typography key={i} variant="body1" component="div" gutterBottom>
            {user}
          </Typography>
        ))
      )}
    </Paper>
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          maxHeight: 300,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Messages:
        </Typography>
        <Stack spacing={2}>
          {messages.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No messages yet.
            </Typography>
          ) : (
            messages.map((m, i) => (
              <Typography key={i} variant="body1" component="div" gutterBottom>
                {m}
              </Typography>
            ))
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default App;
