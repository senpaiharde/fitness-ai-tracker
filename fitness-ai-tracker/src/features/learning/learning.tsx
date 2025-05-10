// src/features/schedule/scheduleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";

export interface LearnCell {
  _id: string;
  userId: string;
  date: string;
  hour: number;
  topic: string;
 
  startTime: string;
  endTime: string;
  
  status?: "planned" | "done" | "skipped";
  priority: "low" | "medium" | "high";
  
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

// — 1. Fetch all entries for a given date
export const fetchLearning = createAsyncThunk<LearnCell[], string>(
  "schedule/fetchDay",
  async (date) => {
    const res = await api.get("/learning", { params: { date } });
    return res.data as LearnCell[];
  }
);

// — 2. Create or update a single hour entry (block edit uses PUT)
export const updatingLearn = createAsyncThunk<
LearnCell,
  { date: string; hour: number; updates: Partial<LearnCell> },
  { state: RootState }
>("schedule/upsertHour", async ({ date, hour, updates }, { getState }) => {


  const existing = getState().learn.byHour[hour];
  if (existing ) {
    const res = await api.put<LearnCell>(`/learning/${existing._id}`, updates);
    return res.data;
  } else {
    const {status, topic, startTime, endTime, priority,  goalId } = updates;
      const payload = {
        date,
        topic,
        startTime,
        endTime,
        
        priority,
        
        goalId,
        status,
      };
    const res = await api.post<LearnCell>("/learning", payload);
    return res.data;
  }
});

// — 3. Delete an entire task by its _id
export const deleteEntryLearn = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("learning/deleteEntry", async (entryId, { getState, dispatch }) => {
  await api.delete(`/learning/${entryId}`);
  // reload the current day to stay in sync
  const date = getState().learn.currentDate;
  dispatch(fetchLearning(date));
  return entryId;
});

interface LearnState {
  byHour: (LearnCell | null)[];
  currentDate: string;
}

const initialState: LearnState = {
  byHour: Array<LearnCell | null>(24).fill(null),
  currentDate: new Date().toISOString().slice(0, 10),
};

const LearnSlice = createSlice({
  name: "Learning",
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // load day
      .addCase(fetchLearning.fulfilled, (state, { payload }) => {
        state.byHour = Array(24).fill(null);
        payload.forEach((entry) => {
          state.byHour[entry.hour] = entry;
        });
      })
      // upsert hour/block
      .addCase(updatingLearn.fulfilled, (state, { payload }) => {
        state.byHour[payload.hour] = payload;
      })
      // delete block: clear any hours matching that _id
      .addCase(deleteEntryLearn.fulfilled, (state, { payload: deletedId }) => {
        state.byHour = state.byHour.map((cell) =>
          cell && cell._id === deletedId ? null : cell
        );
      });
  },
});

export const { setDate } = LearnSlice.actions;
export const selectLearn = (state: RootState) => state.learn.byHour;
export default LearnSlice.reducer;
