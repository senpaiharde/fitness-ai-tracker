import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EnchancementLog = {
    id: number;  
    date: number,
    compound: string;
    dose: number;
    time: number;
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
        updateEnhancementLog: (state, action: PayloadAction<{ id: number; updates: Partial<EnchancementLog> }>) => {
           if(!state.user?.enchancementLog) return
           const idx = state.user.enchancementLog.findIndex(l => l.id === action.payload.id)
           if(idx > -1){
            state.user.enchancementLog[idx] = {
                ...state.user.enchancementLog[idx],
                ...action.payload.updates

            }
           }
        },
        deleteEnhancementLog: (state, action: PayloadAction<{ id: number }>) => {
            if(!state.user?.enchancementLog) return;
            state.user.enchancementLog = state.user.enchancementLog.filter(l => l.id !== action.payload.id)
        }
    },
});

export const { login, logout, updateProfile, addEnchanmentLog,deleteEnhancementLog,updateEnhancementLog } =
    userSlice.actions;
export default userSlice.reducer;
