const { error, success } = require("../Utils/responseWrapper");
const Chat = require("../models/Chat");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const userChat = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUser = req._id;

        if (!userId) {
            return res.send(error(400, "userId is not available."));
        }

        const query = {
            isGroupChat: false,
            users: { $all: [currentUser, userId] },
        };

        const isChat = await Chat.findOne(query)
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("latestMessage.sender", "username email image");

        if (isChat) {
            return res.send(success(200, isChat));
        }

        const newChat = await Chat.create({
            chatname: "sender",
            isGroupChat: false,
            users: [currentUser, userId],
        });

        const createdChat = await Chat.findById(newChat._id)
            .populate("users", "-password")
            .populate("latestMessage")
            .populate("latestMessage.sender", "username email image");

        return res.send(success(201, createdChat));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const getChats = async (req, res) => {
    try {
        const currentUser = req._id;

        const query = {
            users: currentUser,
        };

        const chats = await Chat.find(query)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .populate("latestMessage.sender", "username email image")
            .sort({ updatedAt: -1 });

        return res.send(success(200, chats));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const createGroupChat = async (req, res) => {
    try {
        const { name, users, image } = req.body;
        const currentUser = req._id;

        if (!name || !users) {
            res.send(error(400, "Fill all the fields."));
        }

        // parsing the users coming in stringify format
        const parsedUser = JSON.parse(users);

        // adding currentUser in parsedUser array
        parsedUser.push(currentUser);

        let groupImage =
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

        if (image) {
            // Upload image to Cloudinary
            const cloudImg = await cloudinary.uploader.upload(image, {
                folder: "chatAppImg",
            });

            groupImage = cloudImg.secure_url;
        }

        const groupChat = await Chat.create({
            chatName: name,
            isGroupChat: true,
            users: parsedUser,
            groupAdmin: currentUser,
            image: groupImage,
        });

        if (users.length < 2) {
            return res.send(error(400, "Group must have more than 2 users"));
        }

        const createdGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("image");

        return res.send(success(201, createdGroupChat));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const renameGroup = async (req, res) => {
    try {
        const { chatId, newChatName } = req.body;

        if (!chatId || !newChatName) {
            res.send(error(400, "Fill all the fields."));
        }

        const updatedGroupChat = await Chat.findByIdAndUpdate(
            chatId,
            { chatName: newChatName },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedGroupChat) {
            res.send(error(404, "Group chat not found."));
        }

        return res.send(success(200, updatedGroupChat));
    } catch (error) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const addToGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const updatedGroupChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedGroupChat) {
            res.send(error(404, "Group chat not found."));
        }

        return res.send(success(200, updatedGroupChat));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const removeFromGroup = async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const updatedGroupChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedGroupChat) {
            res.send(error(404, "Group chat not found."));
        }

        return res.send(success(200, updatedGroupChat));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

module.exports = {
    userChat,
    getChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};
