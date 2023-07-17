import React, { useEffect } from "react";
import "./GroupChat.scss";
import { MdGroups } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/userSlice";
import SingleChat from "../singleChat/SingleChat";
import { getUserChats, selectChat } from "../../redux/slices/chatSlice";
import ChatLoading from "../ChatLoading";

function GroupChat() {
    const dispatch = useDispatch();

    const userChats = useSelector((state) => state.chatReducer.userChats);
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const isLoading = useSelector((state) => state.userReducer.isLoading);

    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                dispatch(setLoading(true));
                await dispatch(getUserChats());
            } catch (error) {
                console.error(error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchUserChats();
    }, [dispatch]);

    const handleChatClick = (chat) => {
        dispatch(selectChat(chat));
    };

    return (
        <div className="GroupChat">
            <div className="top">
                <div className="heading">Groups</div>
                <MdGroups />
            </div>

            {isLoading ? (
                <ChatLoading />
            ) : (
                <div className="singleChats">
                    {userChats
                        .filter((chat) => chat.isGroupChat)
                        .map((chat) => {
                            const isSelected = chat === selectedChat;
                            return (
                                <SingleChat
                                    key={chat._id}
                                    chat={chat}
                                    isSelected={isSelected}
                                    handleClick={() => handleChatClick(chat)}
                                />
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default GroupChat;
