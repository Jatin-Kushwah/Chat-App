import React, { useEffect, useState } from "react";
import "./ChattingArea.scss";
import { TOAST_FAILURE } from "../../App";
import { showToast } from "../../redux/slices/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../Utils/axiosClient";
import Messages from "../messages/Messages";
import { IoSendSharp } from "react-icons/io5";
import io from "socket.io-client";

const baseURL =
    process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:4000";
var socket, selectedChatCompare;

function ChattingArea({ chatId }) {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    useEffect(() => {
        socket = io(baseURL);
        socket.emit("setup", loggedUser);
        socket.on("connected", () => {
            setSocketConnected(true);
        });
        socket.on("typing", () => {
            setIsTyping(true);
        });
        socket.on("stop typing", () => {
            setIsTyping(false);
        });
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) {
                return;
            }

            try {
                const response = await axiosClient.get(`/message/${chatId}`);

                setMessages(response.result);

                socket.emit("join chat", selectedChat?._id);
            } catch (error) {
                dispatch(
                    showToast({
                        type: TOAST_FAILURE,
                        message: error,
                    })
                );
            }
        };

        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                // if (!notification.includes(newMessageRecieved)) {
                //   setNotification([newMessageRecieved, ...notification]);
                //   setFetchAgain(!fetchAgain);
                // }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (socketConnected && !typing) {
            setTyping(true);
            socket.emit("typing", selectedChat?._id);
        }

        setTimeout(() => {
            if (typing) {
                socket.emit("stop typing", selectedChat?._id);
                setTyping(false);
            }
        }, 2000);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        socket.emit("stop typing", selectedChat._id);
        try {
            setNewMessage("");
            const response = await axiosClient.post("/message/", {
                text: newMessage,
                chatId,
            });

            socket.emit("new message", response.result);
            setMessages([...messages, response.result]);
        } catch (error) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: error,
                })
            );
        }
    };

    return (
        <div className="ChattingArea">
            <div className="message-container">
                <Messages istyping={istyping} messages={messages} />
            </div>
            <div className="send-input">
                <form onSubmit={sendMessage}>
                    <input
                        className="message-input"
                        type="text"
                        value={newMessage}
                        placeholder="Type Here..."
                        onChange={handleTyping}
                    />
                    <button className="message-send-btn" onClick={sendMessage}>
                        <IoSendSharp />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChattingArea;
