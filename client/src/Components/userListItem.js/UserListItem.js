import React from "react";
import "./UserListItem.scss";

function UserListItem({ user }) {
    return (
        <div className="UserListItem">
            <img src={user.image} alt="user image" />
            <h3>{user.username}</h3>
        </div>
    );
}

export default UserListItem;
