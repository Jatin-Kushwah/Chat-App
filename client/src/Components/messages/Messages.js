import React from "react";
import "./Messages.scss";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
import blankImage from "../../assets/user.png";

function Messages({ messages, istyping, typingUser }) {
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const isTypingUserInMessages = messages.some(
        (message) => message?.sender?._id === typingUser?._id
    );

    return (
        <ScrollableFeed className="Messages">
            {messages &&
                messages.map((message, index) => {
                    const isMessageFromLoggedUser =
                        message?.sender?._id === loggedUser?._id;
                    const nextMessage = messages[index + 1];
                    const showImage =
                        !isMessageFromLoggedUser &&
                        (!nextMessage ||
                            nextMessage?.sender?._id !== message?.sender?._id);

                    return (
                        <div
                            className={`user-message ${
                                isMessageFromLoggedUser ? "my-message" : ""
                            }`}
                            key={message._id}
                        >
                            {showImage ? (
                                <img
                                    src={message.sender.image}
                                    alt="user avatar"
                                />
                            ) : (
                                <img
                                    className="blankImg"
                                    src={blankImage}
                                    alt="user avatar"
                                />
                            )}
                            <span
                                className={`message-text ${
                                    isMessageFromLoggedUser
                                        ? "my-text"
                                        : "user-text"
                                }`}
                            >
                                {message.text}
                            </span>
                        </div>
                    );
                })}

            {istyping &&
            isTypingUserInMessages &&
            typingUser?._id !== loggedUser?._id ? (
                <div className="typing">
                    <img src={typingUser?.image} alt="user avatar" />
                    <Lottie
                        options={defaultOptions}
                        height={40}
                        width={40}
                        style={{
                            margin: 0,
                        }}
                    />
                </div>
            ) : null}
        </ScrollableFeed>
    );
}

export default Messages;
