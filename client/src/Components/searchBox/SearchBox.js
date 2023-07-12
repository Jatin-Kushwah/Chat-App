import React, { useEffect, useState } from "react";
import "./SearchBox.scss";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/slices/userSlice";
import { AiOutlineSearch } from "react-icons/ai";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "../userListItem.js/UserListItem";
import ChatLoading from "../ChatLoading";

function SearchBox() {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const searchResults = useSelector(
        (state) => state.userReducer.searchResults
    );

    useEffect(() => {
        setCount(searchResults?.length);
    }, [searchResults]);

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await dispatch(searchUser(searchQuery));
            setSearchQuery("");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search User..."
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </div>
            </form>
            {loading ? (
                <div style={{ marginTop: "16px" }}>
                    <ChatLoading count={count} />
                </div>
            ) : searchResults && searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((user) => (
                        <UserListItem key={user._id} user={user} />
                    ))}
                </ul>
            ) : (
                <p>Search Results Here</p>
            )}
        </div>
    );
}

export default SearchBox;
