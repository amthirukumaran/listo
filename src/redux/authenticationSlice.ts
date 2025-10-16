import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    showGetStarted: true,
    userDetails: {},
    accountDetails: []
}

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setIsLoggedIn: (state, { payload }) => {
            state.isLoggedIn = payload
        },
        setShowGetStarted: (state, { payload }) => {
            state.showGetStarted = payload
        }
    }
})

export const { setIsLoggedIn, setShowGetStarted } = authSlice.actions;
export default authSlice.reducer