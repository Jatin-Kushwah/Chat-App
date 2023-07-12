import React, { useEffect, useState } from "react";
import "./UserChats.scss";
import { axiosClient } from "../../Utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { getMyInfo } from "../../redux/slices/userSlice";

function UserChats() {
    const [chats, setChats] = useState([]);
    const [loggedUser, setLoggedUser] = useState();

    const dispatch = useDispatch();

    const myInfo = useSelector((state) => state.userReducer.myInfo);

    useEffect(() => {
        dispatch(getMyInfo());
    }, [dispatch]);

    useEffect(() => {
        const fetchChats = async () => {
            const data = await axiosClient.get("/chat/");
            setChats(data.result);
        };

        fetchChats();
    }, []);

    useEffect(() => {
        if (myInfo) {
            setLoggedUser(myInfo);
        }
    }, [myInfo]);

    return (
        <div className="UserChats">
            {chats?.map((chat) => {
                return chat?.users?.map((user) => {
                    if (user.username !== loggedUser?.username) {
                        return (
                            <div
                                key={user._id}
                                onClick={() => console.log(user.username)}
                            >
                                {user.username}
                            </div>
                        );
                    }
                    return null;
                });
            })}
        </div>
    );
}

export default UserChats;
