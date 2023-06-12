const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        chatName: {
            type: String,
        },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("chat", chatSchema);
