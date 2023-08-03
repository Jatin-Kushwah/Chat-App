import React, { useRef, useEffect } from "react";
import "./SingleChat.scss";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../redux/slices/chatSlice";
import { PiCircleFill } from "react-icons/pi";

function SingleChat({ chat, user, handleClick, isSelected }) {
    const chatClassName = isSelected ? "SingleChat selected" : "SingleChat";
    const nameContentRef = useRef(null);
    const dispatch = useDispatch();

    const notification = useSelector((state) => state.chatReducer.notification);

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

    const handleChatClick = async () => {
        if (!notification) {
            return;
        }

        const updatedNotification = notification?.filter(
            (message) => message?.text !== chat?.latestMessage?.text
        );

        dispatch(setNotification(updatedNotification));
    };

    const renderContent = () => {
        const latestMsgTime = chat?.latestMessage?.createdAt
            ? formatMessageTime(chat.latestMessage.createdAt)
            : null;

        const isNewMessageInNotification = notification?.some(
            (message) => message?.text === chat?.latestMessage?.text
        );

        if (user) {
            return (
                <>
                    <img src={user.image} alt="user " />
                    <div className="nameContent" ref={nameContentRef}>
                        <h3>{user.username}</h3>
                        <p>{chat?.latestMessage?.text}</p>
                    </div>
                    {isNewMessageInNotification && (
                        <div className="notification-dot">
                            <PiCircleFill />
                        </div>
                    )}

                    {chat?.latestMessage && (
                        <div className="latest-msg-time">{latestMsgTime}</div>
                    )}
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
                    {isNewMessageInNotification && (
                        <div className="notification-dot">
                            <PiCircleFill />
                        </div>
                    )}

                    {chat?.latestMessage && (
                        <div className="latest-msg-time">{latestMsgTime}</div>
                    )}
                </>
            );
        }
    };

    const formatMessageTime = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);

        if (isSameDay(now, messageDate)) {
            return messageDate.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } else if (isYesterday(now, messageDate)) {
            return "Yesterday";
        } else {
            const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];
            return dayNames[messageDate.getDay()];
        }
    };

    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const isYesterday = (date1, date2) => {
        const yesterday = new Date(date1);
        yesterday.setDate(date1.getDate() - 1);
        return isSameDay(yesterday, date2);
    };

    return (
        <div
            className={chatClassName}
            onClick={() => {
                handleClick();
                handleChatClick();
            }}
        >
            {renderContent()}
        </div>
    );
}

export default SingleChat;
