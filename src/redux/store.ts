import {configureStore} from "@reduxjs/toolkit";
import animalsSlice from "./animalsSlice";

const store = configureStore({
    reducer: {
        animals: animalsSlice,
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch