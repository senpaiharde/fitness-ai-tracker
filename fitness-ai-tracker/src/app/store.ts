import { configureStore } from "@reduxjs/toolkit";



export const  store= configureStore({
    reducer: {
        user: userReducer,
        tracker: trackerReducer
    }

})
// this gives us full auto complate of dispatch and useselector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;