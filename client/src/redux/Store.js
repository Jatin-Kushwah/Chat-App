import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
import appConfigReducer from "./slices/appConfigSlice";

export default configureStore({
    reducer: {
        userReducer,
        chatReducer,
        appConfigReducer,
    },
});
