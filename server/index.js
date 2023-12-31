const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const morgan = require("morgan");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const dbConnect = require("./dbConnect");

const {
    PORT,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_SECTRET_KEY,
} = process.env;

// Configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECTRET_KEY,
});

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(morgan("common"));

let origin = "http://localhost:3000";
if (process.env.NODE_ENV === "production") {
    origin = "https://chatverse-leqo.onrender.com";
}

app.use(
    cors({
        credentials: true,
        origin,
    })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
    res.status(200).send("Server running successfully");
});

dbConnect();

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on PORT ${PORT}`);
});

const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        credentials: true,
        origin:
            process.env.NODE_ENV === "production"
                ? "https://chatverse-leqo.onrender.com"
                : "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", (data) => {
        socket.join(data?._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("room joined " + room);
    });

    socket.on("typing", ({ room, user }) => {
        socket.in(room).emit("user typing", user);
    });

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("user disconnected");
        socket.leave(userData._id);
    });
});
