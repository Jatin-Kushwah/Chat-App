const { success, error } = require("../Utils/responseWrapper");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { username, email, password, image } = req.body;

        if (!username || !email || !password) {
            return res.send(error(400, "All fields are required."));
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send(error(409, "User already exists, Please login."));
        }

        const hashedPass = await bcrypt.hash(password, 10);

        let userImage =
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

        if (image) {
            // Upload image to Cloudinary
            const cloudImg = await cloudinary.uploader.upload(image, {
                folder: "chatAppImg",
            });

            userImage = cloudImg.secure_url;
        }

        const newUser = await User.create({
            username,
            email,
            image: userImage,
            password: hashedPass,
        });

        return res.send(success(201, "User successfully registered."));
    } catch (err) {
        console.log(err);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(error(400, "Email and Password are required."));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.send(error(409, "User does not exist, Please Signup."));
        }

        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) {
            return res.send(error(403, "Username or Password is incorrect"));
        }

        const accessToken = generateAccessToken({
            _id: user._id,
        });

        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        res.cookie(refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, { accessToken }));
    } catch (err) {
        console.log(err);
        return res.send(error(500, err.message));
    }
};

const refreshAccessToken = async (req, res) => {
    const cookies = req.cookies.jwt;

    if (!cookies) {
        return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.status(201).json({ accessToken });
    } catch (err) {
        console.log(err);
        return res.send(error(401, "Invalid refresh token"));
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
        });
        return res.send(success(200, "user logged out"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

//internal functions
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_KEY, {
            expiresIn: "30d",
        });
        return token;
    } catch (err) {
        console.log(err);
    }
};

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: "1y",
        });
        return token;
    } catch (err) {
        console.log(err);
    }
};

module.exports = { signup, login, logout };
