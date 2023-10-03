import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./Slices/authSlice";

const store = configureStore({
    reducers: {
        auth: authSliceReducer
    },
    devtools: true
})

export default store;