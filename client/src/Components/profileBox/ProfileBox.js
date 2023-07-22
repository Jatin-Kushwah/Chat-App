import React, { useEffect, useState } from "react";
import "./ProfileBox.scss";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import userImg from "../../assets/user.png";
import { axiosClient } from "../../Utils/axiosClient";
import { getMyInfo } from "../../redux/slices/userSlice";

function ProfileBox({ user, closeProfile }) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [username, setUsername] = useState("");
    const [userImage, setUserImage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [isImageChanged, setIsImageChanged] = useState(false);

    const dispatch = useDispatch();

    const loggedUser = useSelector((state) => state.userReducer.loggedUser);

    useEffect(() => {
        setUsername(user.username || "");
        setUserEmail(user.email || "");
        setUserImage(user.image || "");
    }, [user]);

    const handleEditButtonClick = () => {
        setIsEditMode(!isEditMode);
    };

    const handleImage = async (e) => {
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            if (fileReader.readyState === fileReader.DONE) {
                setUserImage(fileReader.result);
                setIsImageChanged(true);
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post("/user/", {
                name: username,
                userImg: isImageChanged ? userImage : null,
                email: userEmail,
            });

            dispatch(getMyInfo());
            setIsEditMode(!isEditMode);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="ProfileBox">
            <div className="blank" onClick={closeProfile}></div>
            <div className="profile-container">
                <div className="top">
                    <h3>Profile</h3>
                    <div className="back" onClick={closeProfile}>
                        <RxCross2 />
                    </div>
                </div>

                <div className={`slide-box${isEditMode ? " edit-mode" : ""}`}>
                    <div className="profile">
                        <img src={user.image} alt="avatar" />
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                        {loggedUser === user && (
                            <button
                                className="edit-btn"
                                onClick={handleEditButtonClick}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {loggedUser === user && (
                        <div className="edit-container">
                            <form onSubmit={handleSubmit}>
                                <div className="inputs">
                                    <div className="input-image tooltip">
                                        <span className="tooltiptext">
                                            Select Image
                                        </span>
                                        <label htmlFor="image">
                                            <div className="avatar">
                                                <img
                                                    src={
                                                        userImage
                                                            ? userImage
                                                            : userImg
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
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="New Username"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />

                                    <input
                                        type="text"
                                        placeholder="New email"
                                        value={userEmail}
                                        onChange={(e) =>
                                            setUserEmail(e.target.value)
                                        }
                                    />

                                    <button className="save" type="submit">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileBox;
