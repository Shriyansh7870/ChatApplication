const express = require("express");
const path = require("path");
const { socket } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`chat server on port ${PORT}`)
);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  socketsConected.add(socket.id);
  socket.emit("popup", "Welcome to the chat group!");

  io.emit("client-total", socketsConected.size);

  socket.on("disconnect", () => {
    console.log("socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("client-total", socketsConected.size);
  });
  socket.on("message", (data) => {
    // console.log(data);
    socket.broadcast.emit("message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feeback", data);
  });
}
