import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiClient";

export const fetchDay = createAsyncThunk(
    "schedule/fetchDay",
    async (date: string) => {
        const respone = await api.get(`schedule${date}`);
        return respone.data;
    }
);

export const upsertHour = createAsyncThunk(
    "schedule/upsertHour",
    async ({
        date,
        hour,
        updates,
    }: {
        date: string;
        hour: number;
        updates: Partial<{
            planned: string;
            actual: string;
            tags: string[];
            status: "planned" | "done";
        }>;
    }) => {
        const respone = await api.put(`/schedule/${date}/${hour}`, updates);
        return respone.data;
    }
);

export const deleteHour = createAsyncThunk(
    "schedule/deleteHour",
    async ({ date, hour }: { date: string; hour: number }) => {
        await api.delete(`/schedule/${date}/${hour}`);
        return hour;
    }
);

type HourCell = {
    _id: string;
    userId: string;
    date: string;

    hour: number;
    planned?: string;
    actual?: string;
    tags?: string[];
    status: "planned" | "done";
} | null;

const slice = createSlice({
    name: "schedule",
    initialState: { byHour: Array<HourCell>(24).fill(null) 

    },
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchDay.fulfilled, (state, { payload }) => {
            state.byHour = Array(24).fill(null);
            payload.forEach((entry: HourCell & { hour: number }) => {
                state.byHour[entry.hour] = entry;
            });
        })
            .addCase(upsertHour.fulfilled, (state, { payload }) => {
                state.byHour[payload.hour] = payload;
            })
            .addCase(deleteHour.fulfilled, (state, { payload: hour }) => {
                state.byHour[hour] = null;
            });
    },
});

export const selectSchedule = (state: any) => state.schedule.byHour;

export default slice.reducer;
