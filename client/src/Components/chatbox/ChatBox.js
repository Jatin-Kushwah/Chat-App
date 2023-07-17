import React from "react";
import "./ChatBox.scss";
import loadingImg from "../../assets/uc.jpg";

function ChatBox() {
    return (
        <div className="ChatBox">
            <img style={{ height: "80vh" }} src={loadingImg} alt="uc" />
        </div>
    );
}

export default ChatBox;
