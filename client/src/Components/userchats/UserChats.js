import React, { useEffect, useState } from "react";
import "./UserChats.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    getMyInfo,
    setLoading,
    setLoggedUser,
} from "../../redux/slices/userSlice";
import userImage from "../../assets/user.png";
import SingleChat from "../singleChat/SingleChat";
import { getUserChats, selectChat } from "../../redux/slices/chatSlice";
import ChatLoading from "../ChatLoading";
import { HiSearch } from "react-icons/hi";
import ProfileBox from "../profileBox/ProfileBox";

function UserChats() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredChats, setFilteredChats] = useState([]);
    const [openProfile, setOpenProfile] = useState(false);

    const dispatch = useDispatch();

    const myInfo = useSelector((state) => state.userReducer.myInfo);
    const userChats = useSelector((state) => state.chatReducer.userChats);
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);
    const isLoading = useSelector((state) => state.userReducer.isLoading);

    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                await dispatch(getMyInfo());
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

    useEffect(() => {
        if (myInfo) {
            dispatch(setLoggedUser(myInfo));
        }
    }, [myInfo]);

    useEffect(() => {
        const filteredChats = userChats.filter((chat) => {
            const username = chat?.users?.find(
                (user) => user.username !== loggedUser?.username
            )?.username;
            return username?.toLowerCase().includes(searchTerm?.toLowerCase());
        });
        setFilteredChats(filteredChats);
    }, [userChats, searchTerm, loggedUser]);

    const handleChatClick = (chat) => {
        dispatch(selectChat(chat));
    };

    const renderChats = () => {
        if (searchTerm) {
            return filteredChats
                .filter((chat) => !chat?.isGroupChat)
                .map((chat) =>
                    chat?.users.map((user) => {
                        if (user?.username !== loggedUser?.username) {
                            const isSelected = chat?._id === selectedChat?._id;
                            return (
                                <SingleChat
                                    chat={chat}
                                    key={user._id}
                                    user={user}
                                    isSelected={isSelected}
                                    handleClick={() => handleChatClick(chat)}
                                />
                            );
                        }
                        return null;
                    })
                );
        } else {
            return userChats
                ?.filter((chat) => !chat?.isGroupChat)
                .map((chat) =>
                    chat?.users?.map((user) => {
                        if (user?.username !== loggedUser?.username) {
                            const isSelected = chat?._id === selectedChat?._id;
                            return (
                                <SingleChat
                                    chat={chat}
                                    key={user._id}
                                    user={user}
                                    isSelected={isSelected}
                                    handleClick={() => handleChatClick(chat)}
                                />
                            );
                        }
                        return null;
                    })
                );
        }
    };

    return (
        <div className="UserChats">
            <div className="top">
                <h2 className="heading">Messages</h2>
                <img
                    onClick={() => setOpenProfile(!openProfile)}
                    src={loggedUser?.image ? loggedUser?.image : userImage}
                    alt="user image"
                />
                {openProfile && (
                    <ProfileBox
                        user={loggedUser}
                        closeProfile={() => setOpenProfile(false)}
                    />
                )}
            </div>

            <div className="searchBar">
                <HiSearch className="searchIcon" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <ChatLoading />
            ) : (
                <div className="singleChats">{renderChats()}</div>
            )}
        </div>
    );
}

export default UserChats;
