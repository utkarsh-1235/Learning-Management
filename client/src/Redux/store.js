import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./Slices/authSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer
    },
    devtools: true
})

export default store;