import React from "react";
import "./SingleChat.scss";

function SingleChat({ chat, user, handleClick, isSelected }) {
    const chatClassName = isSelected ? "SingleChat selected" : "SingleChat";

    const renderContent = () => {
        if (user) {
            return (
                <>
                    <img src={user.image} alt="user image" />
                    <div className="nameContent">
                        <h3>{user.username}</h3>
                        <p>message</p>
                    </div>
                </>
            );
        } else if (chat) {
            return (
                <>
                    <img src={chat.image} alt="chat image" />
                    <div className="nameContent">
                        <h3>{chat.chatName}</h3>
                        <p>message</p>
                    </div>
                </>
            );
        }
    };

    return (
        <div className={chatClassName} onClick={handleClick}>
            {renderContent()}
        </div>
    );
}

export default SingleChat;
