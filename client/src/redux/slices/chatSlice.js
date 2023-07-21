import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../Utils/axiosClient";

export const getUserChats = createAsyncThunk("getUserChats", async () => {
    try {
        const response = await axiosClient.get("/chat/");
        return response.result;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
});

export const accessChat = createAsyncThunk("accessChat", async (userId) => {
    try {
        const response = await axiosClient.post("/chat/", { userId });
        return response.result;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
});

const chatSlice = createSlice({
    name: "chatSlice",
    initialState: {
        userChats: [],
        selectedChat: null,
        openedChat: null,
    },
    reducers: {
        selectChat: (state, action) => {
            state.selectedChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserChats.fulfilled, (state, action) => {
                state.userChats = action.payload;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                console.log(action.payload);
                state.openedChat = action.payload;
            });
    },
});

export default chatSlice.reducer;
export const { selectChat } = chatSlice.actions;
