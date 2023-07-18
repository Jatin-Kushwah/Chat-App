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
        image: {
            type: String,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("chat", chatSchema);
