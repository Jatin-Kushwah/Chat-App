import React, { useEffect, useState } from "react";
import "./ChattingArea.scss";
import { TOAST_FAILURE } from "../../App";
import { showToast } from "../../redux/slices/appConfigSlice";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../../Utils/axiosClient";
import Messages from "../messages/Messages";

function ChattingArea({ chatId }) {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) {
                return;
            }

            try {
                const response = await axiosClient.get(`/message/${chatId}`);

                setMessages(response.result);
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
    }, [selectedChat]);

    const handleTyping = async (e) => {
        setNewMessage(e.target.value);
    };
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            setNewMessage("");
            const response = await axiosClient.post("/message/", {
                text: newMessage,
                chatId,
            });

            console.log(response.result);

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
                <Messages messages={messages} />
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
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChattingArea;
