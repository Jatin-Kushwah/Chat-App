import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../Utils/axiosClient";
import textImg from "../../assets/Texting-amico.png";
import dialogBox from "../../assets/dialog.png";
import userImage from "../../assets/user1.png";

import "./Signup.scss";

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");

    const handleImage = async (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setImage(fileReader.result);
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await axiosClient.post("auth/signup", {
                username: name,
                email,
                password,
                image,
            });

            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="Signup">
            <div className="signup-container">
                <div className="left">
                    <h3 className="heading">Welcome to Chatverse!</h3>
                    <div className="chat-image">
                        <img src={textImg} alt="texting img" />
                    </div>
                </div>
                <div className="right">
                    <div className="heading">
                        <img src={dialogBox} alt="message box" />
                        <h3>Signup</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-image tooltip">
                            <span className="tooltiptext">Select Image</span>
                            <label htmlFor="image">
                                <div className="avatar">
                                    <img
                                        src={image ? image : userImage}
                                        alt="user avatar"
                                    />
                                </div>
                            </label>

                            <input
                                type="file"
                                className="image"
                                id="image"
                                accept="image/*"
                                onChange={handleImage}
                            />
                        </div>
                        <input
                            type="name"
                            className="name"
                            id="name"
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            className="email"
                            id="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className="password"
                            id="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input
                            type="submit"
                            className="submit"
                            value="Sign up"
                        />
                    </form>

                    <div className="lines-text">
                        <span>OR</span>
                    </div>

                    <p className="bottom-heading">
                        Already have an account?
                        <span>
                            <Link to="/login">Log In</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
