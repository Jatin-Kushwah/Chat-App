const { success } = require("../Utils/responseWrapper");
const User = require("../models/User");

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

module.exports = { searchUser, getMYInfo };
