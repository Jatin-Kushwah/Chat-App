import React, { useEffect, useState } from "react";
import "./SearchBox.scss";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllUsers,
    searchUser,
    setLoading,
} from "../../redux/slices/userSlice";
import { AiOutlineSearch } from "react-icons/ai";
import UserListItem from "../userListItem/UserListItem";
import ChatLoading from "../ChatLoading";
import { accessChat } from "../../redux/slices/chatSlice";

function SearchBox() {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");

    const searchResults = useSelector(
        (state) => state.userReducer.searchResults
    );
    const isLoading = useSelector((state) => state.userReducer.isLoading);
    const allUsersData = useSelector((state) => state.userReducer.allUsersData);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                dispatch(setLoading(true));
                await dispatch(getAllUsers());
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchAllUsers();
    }, [dispatch]);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            dispatch(setLoading(true));
            await dispatch(searchUser(searchQuery));
            setSearchQuery("");
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleInputChange = async (event) => {
        try {
            dispatch(setLoading(true));
            await setSearchQuery(event.target.value);
            await dispatch(searchUser(event.target.value));
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUserClick = async (userId) => {
        try {
            await dispatch(accessChat(userId));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="SearchBox">
            <form onSubmit={handleSearch}>
                <div className="search-container">
                    <AiOutlineSearch className="search-icon" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        placeholder="Search or start new chat"
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </div>
            </form>
            {isLoading ? (
                <div style={{ marginTop: "16px" }}>
                    <ChatLoading />
                </div>
            ) : (
                <ul>
                    {searchQuery === ""
                        ? allUsersData.map((user) => (
                              <UserListItem
                                  key={user._id}
                                  user={user}
                                  handleUserClick={() =>
                                      handleUserClick(user._id)
                                  }
                              />
                          ))
                        : searchResults.map((user) => (
                              <UserListItem
                                  key={user._id}
                                  user={user}
                                  handleUserClick={() =>
                                      handleUserClick(user._id)
                                  }
                              />
                          ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBox;
