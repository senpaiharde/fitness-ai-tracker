// src/features/schedule/scheduleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";

export interface HourCell {
    _id: string;
    userId: string;
    date: number;
    timestamp: Date;
    hour: number;
    foodItemId?: string;
    manualText?: string;
    grams?: number;
    calories?: number;
    foodLog: "morning" | "evening" | "night";
    macros?: {
        totalCalories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    notes?: string;
}

// — 1. Fetch all entries for a given date
export const fetchFoodLog = createAsyncThunk<HourCell[], string>(
    "food/fetchFoodLog",
    async (date) => {
        const res = await api.get("/food-logs", { params: { date } });
        return res.data as HourCell[];
    }
);

// — 2. Create or update a single hour entry (block edit uses PUT)
export const updateFoodLog = createAsyncThunk<
    HourCell,
    { date: string; hour: number; updates: Partial<HourCell> },
    { state: RootState }
>("food/updateFoodLog", async ({ date, hour, updates }, { getState }) => {
    const existing = getState().schedule.byHour[hour];
    if (existing) {
        const res = await api.put<HourCell>(
            `/food-logs/${existing._id}`,
            updates
        );
        return res.data;
    } else {
        const {
            timestamp,
            foodItemId,
            manualText,
            grams,
            calories,
            macros,
            notes,
        } = updates;
        const payload = {
            date,
            timestamp,
            foodItemId,
            manualText,
            grams,
            calories,
            macros,
            notes,
        };
        const res = await api.post<HourCell>("/food-logs", payload);
        return res.data;
    }
});

// — 3. Delete an entire task by its _id
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
    async (date) => {
      const res = await api.get("/food-logs/summary", { params: { date } });
      return res.data as DiarySummary;
    }
  );
  interface DiarySummary {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    entries: HourCell[];
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
    totals: Totals;          // <- not an array
  }
  
  const initialState: LogState = {
    byHour: Array(24).fill(null),
    currentDate: new Date().toISOString().slice(0, 10),
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  };
  


// diary thunk


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
            // load day
            .addCase(fetchFoodLog.fulfilled, (state, { payload }) => {
                state.byHour = Array(24).fill(null);
                payload.forEach((entry) => {
                    state.byHour[entry.hour] = entry;
                });
            })
            // upsert hour/block
            .addCase(updateFoodLog.fulfilled, (state, { payload }) => {
                state.byHour[payload.hour] = payload;
            })
            // delete block: clear any hours matching that _id
            .addCase(deleteLog.fulfilled, (state, { payload: deletedId }) => {
                state.byHour = state.byHour.map((cell) =>
                    cell && cell._id === deletedId ? null : cell
                );
            })
            .addCase(fetchDiary.fulfilled, (state, { payload }) => {
                state.byHour = Array(24).fill(null);
                payload.entries.forEach((e) => (state.byHour[e.hour] = e));
                state.totals = {
                    calories: payload.totalCalories,
                    protein:  payload.protein,
                    carbs:    payload.carbs,
                    fat:      payload.fat
                  };
            });
    },
});

export const { setLog } = foodLogSlice.actions;
export const selectFoodByHour = (s: RootState) => s.foodLog.byHour;
export const selectTotals     = (s: RootState) => s.foodLog.totals;
export default foodLogSlice.reducer;