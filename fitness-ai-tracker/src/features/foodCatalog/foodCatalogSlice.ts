import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";


export const searchFoodItems = createAsyncThunk(
    "foodCatalog/search",
    async (query:string) => {
        const res = await api.get('food-items/search', {params: {q: query}})
        return res.data as any[]
    }
)

const slice = createSlice({
    name: "foodCatalog",
    initialState: {results: [] as any, status: 'idle' as 'idle'|"loading"},
    reducers: {clear(state) {state.results=[];}},
    extraReducers: (b) => {
        b.addCase(searchFoodItems.pending,
             (s) => 
                {s.status='loading'});
        b.addCase(searchFoodItems.fulfilled,
            (s,a)=>
                {s.status="idle";
                    s.results=a.payload;});
    }
})

export const {clear} = slice.actions;
export const selectResults = (s: RootState) => s.foodCatalog.results;
export default slice.reducer;