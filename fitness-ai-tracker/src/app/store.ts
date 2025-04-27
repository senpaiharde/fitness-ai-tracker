import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import trackerReducer from "../features/tracker/trackerSlice";
import logReducer from "../features/logs/logsSlice";
import scheduleReducer from '../features/schedule/scheduleSlice';
export const  store= configureStore({
    reducer: {
        user: userReducer,
        tracker: trackerReducer,
        logs: logReducer,
        schedule: scheduleReducer
    }

})
// this gives us full auto complate of dispatch and useselector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;