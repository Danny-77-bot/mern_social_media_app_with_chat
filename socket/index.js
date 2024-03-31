const { Server } = require("socket.io");
const io = new Server({ cors: { origin: "http://localhost:5173" } });
let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("New Connection:", socket.id);

    socket.on("addNewUser", (userId) => {
        if (!onlineUsers.some((user) => user.userId === userId)) {
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        }
        console.log("Online Users:", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendNewMessage", (data) => {
        const { recipientId, message } = data;
        const user = onlineUsers.find(user => user.userId === recipientId);
        if (user) {
            io.to(user.socketId).emit("fetchMessages", message);
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(4000);
