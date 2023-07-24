import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../Utils/axiosClient";
import textImg from "../../assets/texting.png";
import dialogBox from "../../assets/dialogBox.png";
import "./Login.scss";
import { KEY_ACCESS_TOKEN, setItem } from "../../Utils/localStorageManager";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
import { useDispatch } from "react-redux";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post("/auth/login", {
                email,
                password,
            });

            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "Logged in successfully",
                })
            );

            setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="Login">
            <div className="login-container">
                <div className="left">
                    <h3 className="heading">Welcome to Chatverse!</h3>
                    <div className="chat-image">
                        <img src={textImg} alt="texting img" />
                    </div>
                </div>
                <div className="right">
                    <div className="heading">
                        <img src={dialogBox} alt="message box" />
                        <h3>Login</h3>
                    </div>
                    <form onSubmit={handleSubmit}>
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
                            value="Log in"
                        />
                    </form>

                    <div className="lines-text">
                        <span>OR</span>
                    </div>

                    <p className="bottom-heading">
                        Already have an account?
                        <span>
                            <Link to="/signup">Sign Up</Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
