import React, { useEffect, useState } from "react";
import "./GroupInfoBox.scss";
import { RxCross2 } from "react-icons/rx";
import { axiosClient } from "../../Utils/axiosClient";
import userImage from "../../assets/user.png";
import { getUserChats, selectChat } from "../../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { searchUser, setLoading } from "../../redux/slices/userSlice";
import UserListItem from "../userListItem/UserListItem";

function GroupInfoBox({ chat, closeGroupInfo }) {
    const dispatch = useDispatch();
    const [loggedUser, setLoggedUser] = useState();
    const [groupImage, setGroupImage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const myInfo = useSelector((state) => state.userReducer.myInfo);
    const searchResults = useSelector(
        (state) => state.userReducer.searchResults
    );

    useEffect(() => {
        if (myInfo) {
            setLoggedUser(myInfo);
        }
    }, [myInfo]);

    useEffect(() => {
        setGroupName(chat?.chatName || "");
        setGroupImage(chat?.image || "");
    }, [chat]);

    const updateLatestData = async (chat) => {
        try {
            dispatch(selectChat(chat));
            dispatch(getUserChats());
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (!query) {
            return;
        }

        try {
            setLoading(true);
            await dispatch(searchUser(query));
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (user) => {
        if (chat?.users.includes(user)) {
            console.log("User is already in the group");
            return;
        }

        if (chat?.groupAdmin?._id !== loggedUser?._id) {
            console.log("Only admins can add the users");
            return;
        }

        try {
            const response = await axiosClient.put("/chat/add", {
                chatId: chat._id,
                userId: user._id,
            });

            updateLatestData(response.result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveUser = async (user) => {
        if (user._id === loggedUser._id) {
            try {
                const response = await axiosClient.delete("/chat/", {
                    data: {
                        chatId: chat._id,
                        userId: user._id,
                    },
                });

                dispatch(selectChat());
                dispatch(getUserChats());
            } catch (error) {
                console.log(error);
            }
        } else if (chat?.groupAdmin?._id === loggedUser?._id) {
            try {
                const response = await axiosClient.delete("/chat/", {
                    data: {
                        chatId: chat._id,
                        userId: user._id,
                    },
                });

                dispatch(selectChat(response.result));
                dispatch(getUserChats());
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("Only admin can remove users from the group.");
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setGroupImage(fileReader.result);
            }
        };
    };

    const handleImageChange = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosClient.put("/chat/image", {
                chatId: chat?._id,
                newImage: groupImage,
            });
            updateLatestData(response.result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNameChange = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosClient.put("/chat/", {
                chatId: chat?._id,
                newChatName: groupName,
            });

            updateLatestData(response.result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="GroupInfoBox">
            <div className="blank" onClick={closeGroupInfo}></div>
            <div className="groupInfo-container">
                <div className="top">
                    <h3>Edit Group</h3>
                    <div className="back" onClick={closeGroupInfo}>
                        <RxCross2 />
                    </div>
                </div>

                <div className="groupInfo-update">
                    <form className="left">
                        <div className="inputs">
                            <div className="input-image">
                                <label htmlFor="image">
                                    <div className="avatar">
                                        <img
                                            src={
                                                groupImage
                                                    ? groupImage
                                                    : userImage
                                            }
                                            alt="user avatar"
                                        />
                                    </div>
                                </label>

                                <input
                                    type="file"
                                    className="image"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImage}
                                />
                                <button
                                    className="change-btn"
                                    onClick={handleImageChange}
                                >
                                    Change
                                </button>
                            </div>
                            <div className="name-input">
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    value={groupName}
                                    onChange={(e) =>
                                        setGroupName(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    className="change-btn"
                                    onClick={handleNameChange}
                                >
                                    Change
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Add user to group"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div
                            className={` selectedUsers ${
                                chat.users && chat.users.length > 0
                                    ? "visible"
                                    : ""
                            }`}
                        >
                            <div className="userList">
                                {chat.users.map((user) => (
                                    <div className="singleUser" key={user._id}>
                                        <div className="name">
                                            {user.username}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveUser(user)
                                            }
                                        >
                                            <TiDelete />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="leave"
                            type="submit"
                            onClick={() => handleRemoveUser(loggedUser)}
                        >
                            Leave
                        </button>
                    </form>

                    <div
                        className={`right ${
                            searchResults &&
                            searchResults.length > 0 &&
                            searchQuery.length > 0
                                ? "visible"
                                : ""
                        }`}
                    >
                        <div className="head">Select Users</div>
                        <ul>
                            {searchResults.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleUserClick={() =>
                                        handleUserClick(user)
                                    }
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupInfoBox;
