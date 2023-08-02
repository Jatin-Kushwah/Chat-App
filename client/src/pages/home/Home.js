import React from "react";
import "./Home.scss";
import { Outlet } from "react-router-dom";
import SideBar from "../../Components/sidebar/SideBar";
import ChatBox from "../../Components/chatbox/ChatBox";
import { useSelector } from "react-redux";

function Home() {
    const selectedChat = useSelector((state) => state.chatReducer.selectedChat);

    return (
        <div className="Home">
            <div className={`sidebar ${selectedChat ? "chat-selected" : ""}`}>
                <SideBar />
            </div>
            <div className={`outlet ${selectedChat ? "chat-selected" : ""}`}>
                <Outlet />
            </div>
            <div className={`chatbox ${selectedChat ? "chat-selected" : ""}`}>
                <ChatBox />
            </div>
        </div>
    );
}

export default Home;
