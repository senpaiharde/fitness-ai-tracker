// src/features/schedule/scheduleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";

export interface HourCell {
  _id: string;
  userId: string;
  date: string;
  hour: number;
  taskTitle: string;
  taskType?: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status?: "planned" | "done" | "skipped";
  priority: "low" | "medium" | "high";
  recurrenceRule?: string;
  goalId?: string;
  createdAt: string;
  updatedAt: string;
}

// — 1. Fetch all entries for a given date
export const fetchDay = createAsyncThunk<HourCell[], string>(
  "schedule/fetchDay",
  async (date) => {
    const res = await api.get("/schedule", { params: { date } });
    return res.data as HourCell[];
  }
);

// — 2. Create or update a single hour entry (block edit uses PUT)
export const upsertHour = createAsyncThunk<
  HourCell,
  { date: string; hour: number; updates: Partial<HourCell> },
  { state: RootState }
>("schedule/upsertHour", async ({ date, hour, updates }, { getState }) => {


  const existing = getState().schedule.byHour[hour];
  if (existing ) {
    const res = await api.put<HourCell>(`/schedule/${existing._id}`, updates);
    return res.data;
  } else {
    const {status, taskTitle, plannedStart, plannedEnd, taskType, priority, recurrenceRule, goalId } = updates;
      const payload = {
        date,
        taskTitle,
        taskType,
        plannedStart,
        plannedEnd,
        priority,
        recurrenceRule,
        goalId,
        status,
      };
    const res = await api.post<HourCell>("/schedule", payload);
    return res.data;
  }
});

// — 3. Delete an entire task by its _id
export const deleteEntry = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("schedule/deleteEntry", async (entryId, { getState, dispatch }) => {
  await api.delete(`/schedule/${entryId}`);
  // reload the current day to stay in sync
  const date = getState().schedule.currentDate;
  dispatch(fetchDay(date));
  return entryId;
});

interface ScheduleState {
  byHour: (HourCell | null)[];
  currentDate: string;
}

const initialState: ScheduleState = {
  byHour: Array<HourCell | null>(24).fill(null),
  currentDate: new Date().toISOString().slice(0, 10),
};

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // load day
      .addCase(fetchDay.fulfilled, (state, { payload }) => {
        state.byHour = Array(24).fill(null);
        payload.forEach((entry) => {
          state.byHour[entry.hour] = entry;
        });
      })
      // upsert hour/block
      .addCase(upsertHour.fulfilled, (state, { payload }) => {
        state.byHour[payload.hour] = payload;
      })
      // delete block: clear any hours matching that _id
      .addCase(deleteEntry.fulfilled, (state, { payload: deletedId }) => {
        state.byHour = state.byHour.map((cell) =>
          cell && cell._id === deletedId ? null : cell
        );
      });
  },
});

export const { setDate } = scheduleSlice.actions;
export const selectSchedule = (state: RootState) => state.schedule.byHour;
export default scheduleSlice.reducer;
