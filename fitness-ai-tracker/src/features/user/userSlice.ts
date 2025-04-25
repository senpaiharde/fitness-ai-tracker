import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EnchancementLog = {
    date: number;
    compound: string;
    dose: number;
    time: string;
    goal?: string;
};

export type UserProfile = {
    id: string;
    email: string;
    name: string | null;
    age?: number;
    weight?: number;
    height?: number;
    isEnchanded: boolean;
    enchancementLog?: EnchancementLog[];
};

type userState = {
    user: UserProfile | null;
    token: string | null;
    isLoggedIn: boolean;
};

const initialState: userState = {
    user: null,
    token: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (
            state,
            action: PayloadAction<{ user: UserProfile; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
        updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        addEnchanmentLog: (state, action: PayloadAction<EnchancementLog>) => {
            if (state.user?.isEnchanded) {
                if (!state.user.enchancementLog) {
                    state.user.enchancementLog = [];
                }
                state.user.enchancementLog.push(action.payload);
            }
        },
    },
});

export const { login, logout, updateProfile, addEnchanmentLog } =
    userSlice.actions;
export default userSlice.reducer;
