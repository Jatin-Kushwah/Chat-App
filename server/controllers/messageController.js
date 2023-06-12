const { error, success } = require("../Utils/responseWrapper");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const sendMessage = async (req, res) => {
    try {
        const { text, chatId } = req.body;

        const sender = req._id;

        const newMessage = await Message.create({
            sender,
            text,
            chat: chatId,
        });

        await newMessage.populate("sender", "username image");
        await newMessage.populate("chat");

        await User.populate(newMessage, {
            path: "chat.users",
            select: "username image email",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: newMessage,
        });

        return res.send(success(200, newMessage));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const getAllMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username image email")
            .populate("chat");

        return res.send(success(200, messages));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

module.exports = { sendMessage, getAllMessages };
