import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SideBar.scss";
import { BsChatSquareText } from "react-icons/bs";
import { MdGroups } from "react-icons/md";
import { BiMessageAdd } from "react-icons/bi";
import { removeItem, KEY_ACCESS_TOKEN } from "../../Utils/localStorageManager";
import { axiosClient } from "../../Utils/axiosClient";
import { TbLogout } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { selectChat } from "../../redux/slices/chatSlice";

function SideBar() {
    const [selectedIcon, setSelectedIcon] = useState("");

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Extract the path from the location object
        const path = location.pathname;

        // Set the selected icon based on the path
        if (path === "/") {
            setSelectedIcon("chat");
        } else if (path === "/search") {
            setSelectedIcon("search");
        } else if (path === "/group") {
            setSelectedIcon("group");
        } else {
            setSelectedIcon("");
        }
    }, [location]);

    const handleIconClick = (iconName, path) => {
        setSelectedIcon(iconName);
        navigate(path);
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post("/auth/logout");
            removeItem(KEY_ACCESS_TOKEN);
            dispatch(selectChat(null));
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="SideBar">
            <div
                className={`chatIcon ${
                    selectedIcon === "chat" ? "selected" : ""
                }`}
                onClick={() => handleIconClick("chat", "/")}
            >
                <BsChatSquareText
                    className={selectedIcon === "chat" ? "selectedIcon" : ""}
                />
            </div>
            <div
                className={`searchIcon ${
                    selectedIcon === "search" ? "selected" : ""
                }`}
                onClick={() => handleIconClick("search", "/search")}
            >
                <BiMessageAdd
                    className={selectedIcon === "search" ? "selectedIcon" : ""}
                />
            </div>
            <div
                className={`groupIcon ${
                    selectedIcon === "group" ? "selected" : ""
                }`}
                onClick={() => handleIconClick("group", "/group")}
            >
                <MdGroups
                    className={selectedIcon === "group" ? "selectedIcon" : ""}
                />
            </div>
            <TbLogout className="logout" onClick={handleLogout} />
        </div>
    );
}

export default SideBar;
