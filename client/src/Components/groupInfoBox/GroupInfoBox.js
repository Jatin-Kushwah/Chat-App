import React, { useEffect, useState } from "react";
import "./GroupInfoBox.scss";
import { RxCross2 } from "react-icons/rx";
import { axiosClient } from "../../Utils/axiosClient";
import userImage from "../../assets/user.png";
import { getUserChats, selectChat } from "../../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { TiDelete } from "react-icons/ti";
import { TbCameraPlus } from "react-icons/tb";
import { searchUser, setLoading } from "../../redux/slices/userSlice";
import UserListItem from "../userListItem/UserListItem";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_FAILURE, TOAST_SUCCESS } from "../../App";

function GroupInfoBox({ chat, closeGroupInfo }) {
    const dispatch = useDispatch();
    const [groupImage, setGroupImage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const searchResults = useSelector(
        (state) => state.userReducer.searchResults
    );
    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

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

    const handleUserClick = async (user) => {
        if (chat?.users.some((u) => u._id === user._id)) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: "User is already in the group",
                })
            );
            return;
        }

        if (chat?.groupAdmin?._id !== loggedUser?._id) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: "Only admin can add the users",
                })
            );
            return;
        }

        try {
            const response = await axiosClient.put("/chat/add", {
                chatId: chat._id,
                userId: user._id,
            });

            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "User added successfully",
                })
            );

            updateLatestData(response.result);
        } catch (error) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: error,
                })
            );
        }
    };

    const handleRemoveUser = async (user) => {
        if (user?._id === loggedUser?._id) {
            try {
                const response = await axiosClient.delete("/chat/", {
                    data: {
                        chatId: chat._id,
                        userId: user._id,
                    },
                });

                dispatch(
                    showToast({
                        type: TOAST_SUCCESS,
                        message: "Group left",
                    })
                );

                dispatch(selectChat());
                dispatch(getUserChats());
            } catch (error) {
                dispatch(
                    showToast({
                        type: TOAST_FAILURE,
                        message: error,
                    })
                );
            }
        } else if (chat?.groupAdmin?._id === loggedUser?._id) {
            try {
                const response = await axiosClient.delete("/chat/", {
                    data: {
                        chatId: chat._id,
                        userId: user._id,
                    },
                });

                dispatch(
                    showToast({
                        type: TOAST_SUCCESS,
                        message: "User removed successfully",
                    })
                );

                dispatch(selectChat(response.result));
                dispatch(getUserChats());
            } catch (error) {
                dispatch(
                    showToast({
                        type: TOAST_FAILURE,
                        message: error,
                    })
                );
            }
        } else {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: "Only admin can remove users from the group.",
                })
            );
        }
    };

    const handleImageChange = async (event) => {
        event.preventDefault();

        if (chat?.groupAdmin?._id !== loggedUser?._id) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: "Only admin can change the group image",
                })
            );
            return;
        }

        try {
            const response = await axiosClient.put("/chat/image", {
                chatId: chat?._id,
                newImage: groupImage,
            });

            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "Image changed successfully",
                })
            );
            updateLatestData(response.result);
        } catch (error) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: error,
                })
            );
        }
    };

    const handleNameChange = async (event) => {
        event.preventDefault();

        if (chat?.groupAdmin?._id !== loggedUser?._id) {
            dispatch(
                showToast({
                    type: TOAST_FAILURE,
                    message: "Only admin can change the group name",
                })
            );
            return;
        }

        try {
            const response = await axiosClient.put("/chat/", {
                chatId: chat?._id,
                newChatName: groupName,
            });

            dispatch(
                showToast({
                    type: TOAST_SUCCESS,
                    message: "Name changed successfully",
                })
            );

            updateLatestData(response.result);
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
                                        <div className="overlay">
                                            <TbCameraPlus className="icon" />
                                        </div>
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
                                {chat?.users?.map((user) => (
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
                            searchResults?.length > 0 &&
                            searchQuery?.length > 0
                                ? "visible"
                                : ""
                        }`}
                    >
                        <div className="head">Select Users</div>
                        <ul>
                            {searchResults?.map((user) => (
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
