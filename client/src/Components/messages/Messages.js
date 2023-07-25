import React from "react";
import "./Messages.scss";
import ScrollableFeed from "react-scrollable-feed";
import { useSelector } from "react-redux";

function Messages({ messages }) {
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    return (
        <ScrollableFeed className="Messages">
            {messages &&
                messages.map((message, index) => {
                    const isMessageFromLoggedUser =
                        message.sender._id === loggedUser._id;
                    const nextMessage = messages[index + 1];
                    const showImage =
                        !isMessageFromLoggedUser &&
                        (!nextMessage ||
                            nextMessage.sender._id !== message.sender._id);

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
        </ScrollableFeed>
    );
}

export default Messages;
