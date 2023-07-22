import { createSlice } from "@reduxjs/toolkit";

const appConfigSlice = createSlice({
    name: "appConfigSlice",
    initialState: {
        isBarLoading: false,
        toastData: {},
    },
    reducers: {
        setBarLoading: (state, action) => {
            state.isBarLoading = action.payload;
        },
        showToast: (state, action) => {
            state.toastData = action.payload;
        },
    },
});

export default appConfigSlice.reducer;
export const { setBarLoading, showToast } = appConfigSlice.actions;
