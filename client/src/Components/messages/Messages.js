import React from "react";
import "./Messages.scss";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

function Messages({ messages, istyping }) {
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

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
                            {showImage && (
                                <img
                                    src={message.sender.image}
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

            {istyping ? (
                <div>
                    <Lottie
                        options={defaultOptions}
                        // height={50}
                        width={40}
                        style={{
                            marginBottom: 15,
                            marginLeft: 0,
                        }}
                    />
                </div>
            ) : null}
        </ScrollableFeed>
    );
}

export default Messages;
