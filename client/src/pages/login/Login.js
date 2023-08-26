import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../Utils/axiosClient";
import dialogBox from "../../assets/dialog.png";
import textImg from "../../assets/Texting-amico.png";
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
    const [showRight, setShowRight] = useState(false);
    const [leftClass, setLeftClass] = useState("scale-up");

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRight(true);
            setLeftClass("scale-down");
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

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
                <div className={`left ${leftClass}`}>
                    <h3 className="heading">Welcome to Chatverse!</h3>
                    <div
                        className={`chat-image  ${
                            showRight ? "no-animate" : ""
                        }`}
                    >
                        <img src={textImg} alt="texting img" />
                    </div>
                </div>
                <div className={`right ${showRight ? "fade-in" : "fade-out"}`}>
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
                        Do not have an account?
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
