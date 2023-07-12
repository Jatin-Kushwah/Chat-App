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
    cloud_name: `${CLOUDINARY_CLOUD_NAME}`,
    api_key: `${CLOUDINARY_API_KEY}`,
    api_secret: `${CLOUDINARY_SECTRET_KEY}`,
});

const app = express();

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(morgan("common"));

app.use(
    cors({
        credentials: true,
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on PORT ${PORT}`);
});
