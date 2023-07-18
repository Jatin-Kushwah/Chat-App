import React from "react";
import "./UserListItem.scss";

function UserListItem({ user, handleUserClick }) {
    return (
        <div className="UserListItem" onClick={handleUserClick}>
            <img src={user.image} alt="user image" />
            <h3>{user.username}</h3>
        </div>
    );
}

export default UserListItem;
