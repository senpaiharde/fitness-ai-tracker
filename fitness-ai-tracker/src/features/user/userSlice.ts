// src/features/user/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import api from "../../services/apiClient";

export interface UserProfile {
    _id: string;
    fullname: string;
    email: string;
    birthdate?: string;
    weightKg?: number;
    heightCm?: number;
    baselineBodyFatPercent?: number;
    goals: string[];
    timeZone: string;
    notificationPrefs: { email: boolean; push: boolean };
    uiTheme: "light" | "dark";
    createdAt: string;
}

interface UserState {
    token: string | null;
    user: UserProfile | null;
    status: "idle" | "loading" | "failed";
}

const initialState: UserState = {
    token: null,
    user: null,
    status: "idle",
};

// ─── Thunks ──────────────────────────────────────────────────────

//  fetchMe: returns UserProfile, takes no arg and access state
export const fetchMe = createAsyncThunk<
    UserProfile,
    void,
    { state: RootState; rejectValue: string }
>("user/fetchMe", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/users/me");
        return res.data as UserProfile;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.error || err.message);
    }
});

//  signup: returns void (we set token & then fetchMe), takes signup form
export const signup = createAsyncThunk<
    void,
    { fullname: string; email: string; password: string },
    { rejectValue: string; dispatch: any }
>(
    "user/signup",
    async ({ fullname, email, password }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post("/auth/signup", {
                fullname,
                email,
                password,
            });
            const { token } = res.data as { token: string };
            dispatch(setToken(token));
            localStorage.setItem("token", token);
            await dispatch(fetchMe());
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.message);
        }
    }
);

//  login:  returns void (we set token & then fetchMe), takes signup form
export const login = createAsyncThunk<
    void,
    { email: string; password: string },
    { rejectValue: string; dispatch: any }
>("user/login", async (creds, { rejectWithValue, dispatch }) => {
    try {
        const res = await api.post("/auth/login", creds);
        const { token } = res.data as { token: string };
        dispatch(setToken(token));
        localStorage.setItem("token", token);
        await dispatch(fetchMe());
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.error || err.message);
    }
});

//  updateProfile: returns updated UserProfile
export const updateProfile = createAsyncThunk<
    UserProfile,
    Partial<UserProfile>,
    { rejectValue: string }
>("user/updateProfile", async (changes, { rejectWithValue }) => {
    try {
        const res = await api.put("/users/me", changes);
        return res.data as UserProfile;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.error || err.message);
    }
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            state.status = "idle";
            localStorage.removeItem("token");
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            // persist it immediately
            localStorage.setItem("token", action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchMe hanlder
            .addCase(fetchMe.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "idle";
            })
            .addCase(fetchMe.rejected, (state) => {
                state.status = "failed";
            })

            // signup hanlder
            .addCase(signup.pending, (state) => {
                state.status = "loading";
            })
            .addCase(signup.fulfilled, (state) => {
                state.status = "idle";
            })
            .addCase(signup.rejected, (state) => {
                state.status = "failed";
            })

            // login  hanlder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state) => {
                state.status = "idle";
            })
            .addCase(login.rejected, (state) => {
                state.status = "failed";
            })

            // updateProfile  hanlder
            .addCase(updateProfile.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = "idle";
            })
            .addCase(updateProfile.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { logout, setToken } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export const selectToken = (state: RootState) => state.user.token;
export default userSlice.reducer;
