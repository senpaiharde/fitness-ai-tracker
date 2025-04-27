import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchDay = createAsyncThunk(
    'schedule/fetchDay',
    async (date:string) => (
        await api.get(`/schedule/${date}`)).data

    
)