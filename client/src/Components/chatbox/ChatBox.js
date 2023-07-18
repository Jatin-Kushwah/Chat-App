import React, { useEffect, useState } from "react";
import "./ChatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import selectImg from "../../assets/SelectChat.png";
import { selectChat } from "../../redux/slices/chatSlice";

function ChatBox() {
    const dispatch = useDispatch();
    const [loggedUser, setLoggedUser] = useState();

    const myInfo = useSelector((state) => state.userReducer.myInfo);
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const openedChat = useSelector((state) => state.chatReducer.openedChat);

    useEffect(() => {
        if (myInfo) {
            setLoggedUser(myInfo);
        }
    }, [myInfo]);

    useEffect(() => {
        if (openedChat) {
            dispatch(selectChat(openedChat));
        }
    }, [openedChat, dispatch]);

    const chatData = selectedChat;

    return (
        <div className="ChatBox">
            {chatData ? (
                <div className="chat-container">
                    {!chatData?.isGroupChat &&
                        chatData?.users?.map((user) => {
                            if (user?._id !== loggedUser?._id) {
                                return (
                                    <div key={user?._id}>{user?.username}</div>
                                );
                            }
                            return null;
                        })}
                    {chatData?.isGroupChat && <div>{chatData?.chatName}</div>}
                </div>
            ) : (
                <div className="start-heading">
                    <p>Select a chat to start</p>
                    <img src={selectImg} alt="Select" />
                </div>
            )}
        </div>
    );
}

export default ChatBox;
