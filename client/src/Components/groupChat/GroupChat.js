import React, { useEffect, useState } from "react";
import "./GroupChat.scss";
import { MdGroups, MdGroupAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/userSlice";
import SingleChat from "../singleChat/SingleChat";
import { getUserChats, selectChat } from "../../redux/slices/chatSlice";
import ChatLoading from "../ChatLoading";
import NewGroupBox from "./newGroupBox/NewGroupBox";

function GroupChat() {
    const dispatch = useDispatch();
    const [openNewGroup, setOpenNewGroup] = useState(false);

    const userChats = useSelector((state) => state.chatReducer.userChats);
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const isLoading = useSelector((state) => state.userReducer.isLoading);

    useEffect(() => {
        fetchUserChats();
    }, []);

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

    const handleChatClick = (chat) => {
        dispatch(selectChat(chat));
    };

    const handleNewGroupBoxClose = () => {
        setOpenNewGroup(false);
        fetchUserChats();
    };

    return (
        <div className="GroupChat">
            <div className="top">
                <div className="heading">Groups</div>
                <MdGroups />
            </div>

            <div
                className="newGroup"
                onClick={() => setOpenNewGroup(!openNewGroup)}
            >
                <MdGroupAdd />
                <span>Create new group</span>
            </div>

            {openNewGroup && (
                <NewGroupBox closeNewGroup={handleNewGroupBoxClose} />
            )}

            {isLoading ? (
                <ChatLoading />
            ) : (
                <div className="singleChats">
                    {userChats
                        .filter((chat) => chat.isGroupChat)
                        .map((chat) => {
                            const isSelected = chat?._id === selectedChat?._id;
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
