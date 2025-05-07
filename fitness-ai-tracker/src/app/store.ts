import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import trackerReducer from "../features/tracker/trackerSlice";
import logReducer from "../features/logs/logsSlice";
import scheduleReducer from '../features/schedule/scheduleSlice';
import foodLogReducer from '../features/food/foodLogs';
import foodCatalogReducer from '../features/foodCatalog/foodCatalogSlice';
export const  store= configureStore({
    reducer: {
        user: userReducer,
        tracker: trackerReducer,
        logs: logReducer,
        schedule: scheduleReducer,
        foodLog: foodLogReducer,
        foodCatalog: foodCatalogReducer,
    }

})
// this gives us full auto complate of dispatch and useselector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;