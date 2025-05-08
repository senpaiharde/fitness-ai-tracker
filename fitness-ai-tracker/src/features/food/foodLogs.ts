import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";

export interface HourCell {
    _id: string;
    userId: string;
    date: string;
    timestamp: string;
    hour: number;
    foodItemId?: any; // populated or string
    manualText?: string;
    grams?: number;
    calories?: number;
    macros?: {
        totalCalories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
    };
    notes?: string;
}

interface Totals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}
interface LogState {
    byHour: (HourCell | null)[];
    currentDate: string;
    totals: Totals;
}

const initialState: LogState = {
    byHour: Array(24).fill(null),
    currentDate: new Date().toISOString().slice(0, 10),
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
};

export const fetchDiary = createAsyncThunk<
    {
        totalCalories: number;
        protein: number;
        carbs: number;
        fat: number;
        entries: HourCell[];
    },
    string
>("foodLog/fetchDiary", async (date) => {
    const res = await api.get("/food-logs/summary", { params: { date } });
    return res.data;
});

export const updateFoodLog = createAsyncThunk<
    HourCell,
    { date: string; hour: number; updates: Partial<HourCell> },
    { state: RootState }
>("foodLog/updateFoodLog", async ({ date, hour, updates }, { getState }) => {
    const existing = getState().foodLog.byHour[hour];
    if (existing) {
        const res = await api.put<HourCell>(
            `/food-logs/${existing._id}`,
            updates
        );
        return res.data;
    }
    const payload = { date, ...updates };
    const res = await api.post<HourCell>("/food-logs", payload);
    return res.data;
});

const foodLogSlice = createSlice({
    name: "foodLog",
    initialState,
    reducers: {
        setLog(state, action: PayloadAction<string>) {
            state.currentDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDiary.fulfilled, (state, action) => {
                state.byHour = Array(24).fill(null);
                action.payload.entries.forEach(
                    (e) => (state.byHour[e.hour] = e)
                );
                state.totals = {
                    calories: action.payload.totalCalories,
                    protein: action.payload.protein,
                    carbs: action.payload.carbs,
                    fat: action.payload.fat,
                };
            })
            .addCase(updateFoodLog.fulfilled, (state, action) => {
                state.byHour[action.payload.hour] = action.payload;
            });
    },
});

export const { setLog } = foodLogSlice.actions;
export const selectFoodByHour = (state: RootState) => state.foodLog.byHour;
export const selectTotals = (state: RootState) => state.foodLog.totals;
export default foodLogSlice.reducer;
