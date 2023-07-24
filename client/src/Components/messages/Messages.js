import React from "react";
import "./Messages.scss";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";

function Messages({ messages }) {
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    let lastSender = null;

    return (
        <ScrollableFeed className="Messages">
            {messages &&
                messages.map((message, index) => {
                    const isSender = message.sender._id === loggedUser._id;
                    const showImage =
                        lastSender !== message.sender._id && !isSender;
                    lastSender = message.sender._id;

                    return (
                        <div
                            className={`user-message ${
                                isSender ? "my-message" : ""
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
                                    isSender ? "my-text" : "user-text"
                                }`}
                            >
                                {message.text}
                            </span>
                        </div>
                    );
                })}
        </ScrollableFeed>
    );
}

export default Messages;
