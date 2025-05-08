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

interface DiarySummary {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    entries: HourCell[];
}

const initialState: LogState = {
    byHour: Array(24).fill(null),
    currentDate: new Date().toISOString().slice(0, 10),
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
};
export const fetchFoodLog = createAsyncThunk<HourCell[], string>(
    "food/fetchFoodLog",
    async (date) => {
        const res = await api.get("/food-logs", { params: { date } });
        return res.data;
    }
);
export const deleteLog = createAsyncThunk<string, string, { state: RootState }>(
    "foodLog/deleteLog",
    async (entryId, { getState, dispatch }) => {
        await api.delete(`/food-logs/${entryId}`);
        // reload the current day to stay in sync
        const date = getState().schedule.currentDate;
        dispatch(fetchFoodLog(date));
        return entryId;
    }
);
export const fetchDiary = createAsyncThunk<DiarySummary, string>(
    "foodLog/fetchDiary",
    async (date, { dispatch }) => {
        const entries = await dispatch(fetchFoodLog(date)).unwrap();
        const totalCalories = entries.reduce(
            (sum, e) => sum + (e.calories ?? 0),
            0
        );
        const protein = entries.reduce(
            (sum, e) => sum + (e.macros?.protein ?? 0),
            0
        );
        const carbs = entries.reduce(
            (sum, e) => sum + (e.macros?.carbs ?? 0),
            0
        );
        const fat = entries.reduce((sum, e) => sum + (e.macros?.fat ?? 0), 0);
        return { totalCalories, protein, carbs, fat, entries };
    }
);

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
            .addCase(fetchFoodLog.fulfilled, (state, { payload }) => {
                state.byHour = Array(24).fill(null);
                payload.forEach((entry) => {
                    state.byHour[entry.hour] = entry;
                });
            })
            .addCase(fetchDiary.fulfilled, (state, { payload }) => {
                state.byHour  = Array(24).fill(null);
                payload.entries.forEach(e => state.byHour[e.hour] = e);
                state.totals  = {
                  calories: payload.totalCalories,
                  protein:  payload.protein,
                  carbs:    payload.carbs,
                  fat:      payload.fat
                };
              })
            .addCase(updateFoodLog.fulfilled, (state, action) => {
                state.byHour[action.payload.hour] = action.payload;
            })
            .addCase(deleteLog.fulfilled, (state, { payload: deletedId }) => {
                state.byHour = state.byHour.map((cell) =>
                    cell && cell._id === deletedId ? null : cell
                );
            });
    },
});

export const { setLog } = foodLogSlice.actions;
export const selectFoodByHour = (state: RootState) => state.foodLog.byHour;
export const selectTotals = (state: RootState) => state.foodLog.totals;
export default foodLogSlice.reducer;
