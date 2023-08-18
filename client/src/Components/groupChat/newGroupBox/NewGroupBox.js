import React, { useState } from "react";
import "./NewGroupBox.scss";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../../redux/slices/userSlice";
import UserListItem from "../../userListItem/UserListItem";
import { TiDelete } from "react-icons/ti";
import { TbCameraPlus } from "react-icons/tb";
import userImage from "../../../assets/group.png";
import { axiosClient } from "../../../Utils/axiosClient";

function NewGroupBox({ closeNewGroup }) {
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupImage, setGroupImage] = useState("");

    const searchResults = useSelector(
        (state) => state.userReducer.searchResults
    );

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

    const handleUserClick = (user) => {
        if (selectedUsers.includes(user)) {
            console.log("User is already in the group");
            return;
        }
        setSelectedUsers([...selectedUsers, user]);
    };

    const handleDeleteUser = (userId) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!groupName || selectedUsers.length < 2) {
            console.log("Group must have more than 2 users");
            return;
        }

        try {
            const response = await axiosClient.post("/chat/group", {
                name: groupName,
                users: JSON.stringify(selectedUsers.map((user) => user._id)),
                image: groupImage,
            });
        } catch (error) {
            console.log(error);
        }

        setGroupName("");
        setSearchQuery("");
        setSelectedUsers([]);
        closeNewGroup();
    };

    return (
        <div className="NewGroupBox">
            <div className="blank" onClick={closeNewGroup}></div>
            <div className="newGroup_container">
                <div className="top-bar">
                    <h3>Create a new group</h3>
                    <div className="back" onClick={closeNewGroup}>
                        <RxCross2 />
                    </div>
                </div>

                <div className="newGroup_create">
                    <form className="left" onSubmit={handleSubmit}>
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
                            </div>
                            <input
                                type="text"
                                placeholder="Group Name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />

                            <input
                                type="text"
                                placeholder="Add User"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <div
                            className={` selectedUsers ${
                                selectedUsers && selectedUsers.length > 0
                                    ? "visible"
                                    : ""
                            }`}
                        >
                            <div className="userList">
                                {selectedUsers.map((user) => (
                                    <div className="singleUser" key={user._id}>
                                        <div className="name">
                                            {user.username}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteUser(user._id)
                                            }
                                        >
                                            <TiDelete />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="create" type="submit">
                            Create Chat
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

export default NewGroupBox;
