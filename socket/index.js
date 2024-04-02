const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New Connection:", socket.id);

  socket.on("addNewUser", (userId) => {
    try {
      if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
        console.log("Online Users:", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
      }
    } catch (error) {
      console.error("Error adding new user:", error);
    }
  });

  socket.on("sendNewMessage", (data) => {
    try {
      const { recipientId, message } = data;
      const user = onlineUsers.find(user => user.userId === recipientId);
      if (user) {
        io.to(user.socketId).emit("fetchMessages", message);
        io.to(user.socketId).emit("getNotification", {
          senderId: message.senderId,
          isRead: false,
          date: new Date()
        });
      }
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  });

  socket.on("disconnect", () => {
    try {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      console.log("Online Users:", onlineUsers);
      io.emit("getOnlineUsers", onlineUsers);
    } catch (error) {
      console.error("Error handling disconnection:", error);
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
