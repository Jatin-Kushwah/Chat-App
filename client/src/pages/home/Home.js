import React from "react";
import "./Home.scss";
import { Outlet } from "react-router-dom";
import SideBar from "../../Components/sidebar/SideBar";
import ChatBox from "../../Components/chatbox/ChatBox";

function Home() {
    return (
        <div className="Home">
            <SideBar />
            <Outlet />
            <ChatBox />
        </div>
    );
}

export default Home;
