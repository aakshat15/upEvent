import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: sessionStorage.getItem("token") || null,
        user: sessionStorage.getItem("user") || null,
        isAuthenticated: !!sessionStorage.getItem("token")//IT MEAN IF RETRUN TOKEN AND TOKEN IS STRING SO IT WAS CONVERT TRUE TO TRUE
    },
    reducers: {
        //IT IS A DISPATCH FUNCTION

        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            
            state.user = { ...action.payload.user };
            delete state.user.password;
                    
            state.isAuthenticated = true;

            sessionStorage.setItem("token", action.payload.token);
            sessionStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        logOut: (state, action) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            // Remove from sessionStorage
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
        }
    }
})

export const { loginSuccess, logOut } = authSlice.actions;
export default authSlice.reducer;