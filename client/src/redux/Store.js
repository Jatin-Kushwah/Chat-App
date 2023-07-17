import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";

export default configureStore({
    reducer: {
        userReducer,
        chatReducer,
    },
});
