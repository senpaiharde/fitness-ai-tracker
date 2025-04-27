import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiClient";


export const fetchDay = createAsyncThunk(
    'schedule/fetchDay',
    async (date:string) => (
        await api.get(`/schedule/${date}`)).data  
);

export const upsertHour = createAsyncThunk(
    'schedule/upsertHour',
    async ({date,hour,updates}: {date:string; hour:number; updates: any}) => (
        await api.put(`/schedule/${date}/${hour}`, updates)).data
);

export const deleteHour = createAsyncThunk(
    'schedule/deleteHour',
    async ({date,hour}:{date:string; hour:number}) => {
        await api.delete(`/schedule/${date}/${hour}`);
        return hour;
    }
)

type HourCell = {hour:number; planned? :string, actual?:string, status?:string|null} |null;


const slice = createSlice({
    name:'schedule',
    initialState:{byHour: Array<HourCell>(24).fill(null)},
    reducers:{},
    extraReducers: (b) => {
        b.addCase(fetchDay.fulfilled,(s,{payload})=>{
            s.byHour = Array(24).fill(null);
            payload.forEach((e:any) => {
                s.byHour[e.hour]=e;});
        })
        .addCase(upsertHour.fulfilled,(s,{payload}) => {
            s.byHour[payload.hour] = payload;
        })
        .addCase(deleteHour.fulfilled,(s,{payload:hour}) => {
            s.byHour[hour] = null;
        })
    }
})

export const selectSchedule = (state:any)=>state.schedule.byHour;

export default slice.reducer;