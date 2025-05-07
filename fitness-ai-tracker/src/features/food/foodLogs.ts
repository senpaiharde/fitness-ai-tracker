// src/features/schedule/scheduleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";

export interface HourCell {
    _id: string;
    userId: string,
    date: number,
    timestamp: Date;
    hour: number;
    foodItemId?: string;
    manualText?: string;
    grams?: number;
    calories?: number;
    foodLog: 'morning'| 'evening'| 'night'; 
    macros?: {
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
  if (existing ) {
    const res = await api.put<HourCell>(`/food-logs/${existing._id}`, updates);
    return res.data;
  } else {
    const {timestamp,foodItemId,manualText,grams,calories,macros,notes } = updates;
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
    const res = await api.post<HourCell>("/foodLog", payload);
    return res.data;
  }
});

// — 3. Delete an entire task by its _id
export const deleteLog = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("foodLog/deleteLog", async (entryId, { getState, dispatch }) => {
  await api.delete(`/foodLog/${entryId}`);
  // reload the current day to stay in sync
  const date = getState().schedule.currentDate;
  dispatch(fetchFoodLog(date));
  return entryId;
});

interface LogState {
  byHour: (HourCell | null)[];
  currentDate: string;
}

const initialState: LogState = {
  byHour: Array<HourCell | null>(24).fill(null),
  currentDate: new Date().toISOString().slice(0, 10),
};

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
      });
  },
});

export const { setLog } = foodLogSlice.actions;
export const LogFood = (state: RootState) => state.schedule.byHour;
export default foodLogSlice.reducer;
