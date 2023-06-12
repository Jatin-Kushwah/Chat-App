const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const morgan = require("morgan");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");
const messageRouter = require("./routers/messageRouter");
const dbConnect = require("./dbConnect");

const { PORT } = process.env;

const app = express();

// Middlewares
app.use(express.json());
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

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
