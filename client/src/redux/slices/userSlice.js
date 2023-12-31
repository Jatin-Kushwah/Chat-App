import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../Utils/axiosClient";

export const getMyInfo = createAsyncThunk("myInfo", async () => {
    try {
        const response = await axiosClient.get("/user/myInfo");
        return response.result.user;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
});

export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
    try {
        const response = await axiosClient.get("/user/getAllUsers");
        return response.result;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
});

export const searchUser = createAsyncThunk(
    "userSlice/searchUser",
    async (searchQuery) => {
        try {
            const response = await axiosClient.get(
                `/user?search=${searchQuery}`
            );
            return response.result;
        } catch (error) {
            return Promise.reject(error);
        }
    }
);

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        isLoading: false,
        myInfo: null,
        searchResults: [],
        loggedUser: null,
        allUsersData: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setLoggedUser: (state, action) => {
            state.loggedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyInfo.fulfilled, (state, action) => {
                state.myInfo = action.payload;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.allUsersData = action.payload;
            })
            .addCase(searchUser.fulfilled, (state, action) => {
                state.searchResults = action.payload;
            });
    },
});

export default userSlice.reducer;
export const { setLoading, setLoggedUser } = userSlice.actions;
