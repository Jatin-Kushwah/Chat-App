import React, { useRef, useEffect } from "react";
import "./SingleChat.scss";

function SingleChat({ chat, user, handleClick, isSelected }) {
    const chatClassName = isSelected ? "SingleChat selected" : "SingleChat";
    const nameContentRef = useRef(null);

    useEffect(() => {
        const truncateTextIfOverflow = () => {
            const nameContentDiv = nameContentRef.current;
            const pTag = nameContentDiv.querySelector("p");
            const hasOverflow = pTag.scrollWidth > nameContentDiv.clientWidth;

            if (hasOverflow) {
                pTag.textContent = chat?.latestMessage?.text;
                while (pTag.scrollWidth > nameContentDiv.clientWidth) {
                    pTag.textContent = pTag.textContent.slice(0, -1);
                }
                pTag.textContent += "...";
            } else {
                pTag.textContent = chat?.latestMessage?.text;
            }
        };

        truncateTextIfOverflow();
    }, [chat?.latestMessage?.text]);

    const renderContent = () => {
        if (user) {
            return (
                <>
                    <img src={user.image} alt="user " />
                    <div className="nameContent" ref={nameContentRef}>
                        <h3>{user.username}</h3>
                        <p>{chat?.latestMessage?.text}</p>
                    </div>
                </>
            );
        } else if (chat) {
            return (
                <>
                    <img src={chat.image} alt="chat " />
                    <div className="nameContent" ref={nameContentRef}>
                        <h3>{chat.chatName}</h3>
                        <p>{chat?.latestMessage?.text}</p>
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
