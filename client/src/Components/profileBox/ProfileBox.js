import React from "react";
import "./ProfileBox.scss";

function ProfileBox({ closeProfile }) {
    return (
        <div className="ProfileBox">
            <div className="blank" onClick={closeProfile}></div>
            <div className="profile-container">Profile</div>
        </div>
    );
}

export default ProfileBox;
