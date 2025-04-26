// src/features/user/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  age?: number;
  weight?: number;
  height?: number;
  isEnchanded: boolean;
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



export const signup = createAsyncThunk<
  { token: string; user: UserProfile },
  { email: string; password: string; name: string }
>("user/signup", async (credentials, thunkAPI) => {
  // 1️⃣ Create the account
  const res1 = await fetch("http://localhost:4000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res1.ok) throw new Error("Signup failed");
  const { token } = await res1.json();

  // 2️⃣ Immediately fetch the new user’s profile
  const res2 = await fetch("http://localhost:4000/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res2.ok) throw new Error("Fetch profile after signup failed");
  const user = await res2.json();

  return { token, user };
});
// 1️⃣ Login thunk
export const login = createAsyncThunk<
  { token: string; user: UserProfile },
  { email: string; password: string }
>("user/login", async (creds, thunkAPI) => {
  const res = await fetch("http://localhost:4000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error("Login failed");
  return await res.json();
});

// 2️⃣ Fetch “me” thunk
export const fetchMe = createAsyncThunk<UserProfile, void, { state: RootState }>(
  "user/fetchMe",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().user.token;
    const res = await fetch("http://localhost:4000/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Fetch profile failed");
    return await res.json();
  }
);

// 3️⃣ Update profile thunk
export const updateProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile>,
  { state: RootState }
>("user/updateProfile", async (changes, thunkAPI) => {
  const token = thunkAPI.getState().user.token;
  const res = await fetch("http://localhost:4000/user/me", {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error("Update profile failed");
  return await res.json();
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (s) => { s.status = "loading"; })
      .addCase(signup.fulfilled, (s, { payload }) => {
        s.status = "idle";
        s.token = payload.token;
        s.user  = payload.user;
      })
      .addCase(signup.rejected, (s) => { s.status = "failed"; })

      // login
      .addCase(login.pending, (s) => { s.status = "loading"; })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "idle";
        s.token = a.payload.token;
        s.user  = a.payload.user;
      })
      .addCase(login.rejected, (s) => { s.status = "failed"; })
      // fetchMe
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
      // updateProfile
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
