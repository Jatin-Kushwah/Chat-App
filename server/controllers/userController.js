const { success, error } = require("../Utils/responseWrapper");
const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req._id;
        const users = await User.find(
            { _id: { $ne: currentUserId } },
            { _id: 1, username: 1, image: 1 }
        );

        return res.send(success(200, users));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const searchUser = async (req, res) => {
    try {
        const currentUser = req._id;

        const users = req.query.search
            ? await User.find({
                  username: { $regex: req.query.search, $options: "i" },
                  email: { $regex: req.query.search, $options: "i" },
                  _id: { $ne: currentUser },
              })
            : null;

        return res.send(success(200, users));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const getMYInfo = async (req, res) => {
    try {
        const user = await User.findById(req._id);
        return res.send(success(200, { user }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

const updateMyInfo = async (req, res) => {
    try {
        const { name, userImg } = req.body;

        const user = await User.findById(req._id);

        if (name) {
            user.username = name;
        }
        if (userImg) {
            const cloudImg = await cloudinary.uploader.upload(userImg, {
                folder: "chatAppImg",
            });
            user.image = cloudImg.secure_url;
        }
        await user.save();
        return res.send(success(200, { user }));
    } catch (err) {
        return res.send(error(500, err.message));
    }
};

module.exports = { searchUser, getMYInfo, updateMyInfo, getAllUsers };
