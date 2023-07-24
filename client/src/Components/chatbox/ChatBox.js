import React, { useEffect, useState } from "react";
import "./ChatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import selectImg from "../../assets/SelectChat.png";
import { selectChat } from "../../redux/slices/chatSlice";
import ProfileBox from "../profileBox/ProfileBox";
import GroupInfoBox from "../groupInfoBox/GroupInfoBox";
import ChattingArea from "../chattingArea/ChattingArea";

function ChatBox() {
    const dispatch = useDispatch();
    const [user, setUser] = useState();
    const [openProfile, setOpenProfile] = useState(false);
    const [openGroupInfo, setOpenGroupInfo] = useState(false);
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const openedChat = useSelector((state) => state.chatReducer.openedChat);
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    const openChat = async (chat) => {
        try {
            await dispatch(selectChat(chat));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (openedChat) {
            openChat(openedChat);
        }
    }, [openedChat, dispatch]);

    const chatData = selectedChat;

    useEffect(() => {
        if (chatData && loggedUser) {
            const otherUser = chatData?.users?.find(
                (user) => user._id !== loggedUser?._id
            );
            setUser(otherUser);
        }
    }, [chatData, loggedUser]);

    return (
        <div className="ChatBox">
            {chatData ? (
                <div className="chat-container">
                    <div className="topBar">
                        {!chatData?.isGroupChat && user && (
                            <>
                                <div
                                    className="userProfile"
                                    onClick={() => setOpenProfile(!openProfile)}
                                >
                                    <img src={user.image} alt="user avatar" />
                                    <h3>{user.username}</h3>
                                </div>
                                {openProfile && (
                                    <ProfileBox
                                        user={user}
                                        closeProfile={() =>
                                            setOpenProfile(false)
                                        }
                                    />
                                )}
                            </>
                        )}
                        {chatData?.isGroupChat && (
                            <>
                                <div
                                    className="userProfile"
                                    onClick={() =>
                                        setOpenGroupInfo(!openGroupInfo)
                                    }
                                >
                                    <img
                                        src={chatData?.image}
                                        alt="chat avatar"
                                    />
                                    <h3>{chatData?.chatName}</h3>
                                </div>
                                {openGroupInfo && (
                                    <GroupInfoBox
                                        chat={chatData}
                                        openChat={openChat}
                                        closeGroupInfo={() =>
                                            setOpenGroupInfo(false)
                                        }
                                    />
                                )}
                            </>
                        )}
                    </div>

                    <div className="chatting">
                        <ChattingArea chatId={chatData?._id} />
                    </div>
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
