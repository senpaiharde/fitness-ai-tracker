import { createSlice, PayloadAction } from "@reduxjs/toolkit";



export type UserProfile = {
    id: string,
    email: string,
    age? :number,
    weight?: number,
    height?:number,
    isEnchanded: boolean,

}

type userState = {
    user : UserProfile | null;
    token: string | null;
    isLoggedIn: boolean;
};

const initialState: userState = {
    user: null,
    token: null,
    isLoggedIn: false,
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state,action :PayloadAction<{user : UserProfile, token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token
            state.isLoggedIn = true;
        },
        logout : (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if(state.user) {
                state.user = {...state.user, ...action.payload}
            }

        },
    },
});

export const {login,logout, updateProfile} = userSlice.actions;
export default userSlice.reducer;