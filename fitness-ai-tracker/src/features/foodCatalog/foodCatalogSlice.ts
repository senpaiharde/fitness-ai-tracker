import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/apiClient";
import type { RootState } from "../../app/store";


export interface FoodItem {
    _id: string;
    name: string;
    servingSizeGrams: number;
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
  }
  
  export const searchFoodItems = createAsyncThunk<FoodItem[], string>(
    'foodCatalog/search',
    async (query) => {
      const res = await api.get<FoodItem[]>('food-items/search', { params: { q: query } });
      return res.data;
    }
  );
  
  interface CatalogState {
    results: FoodItem[];
    status: 'idle' | 'loading';
  }
  
  const initialCatalogState: CatalogState = {
    results: [],
    status: 'idle',
  };
  
  const foodCatalogSlice = createSlice({
    name: 'foodCatalog',
    initialState: initialCatalogState,
    reducers: {
      clear(state) { state.results = []; }
    },
    extraReducers: builder => {
      builder
        .addCase(searchFoodItems.pending, state => { state.status = 'loading'; })
        .addCase(searchFoodItems.fulfilled, (state, action) => {
          state.status = 'idle';
          state.results = action.payload;
        });
    }
  });
  
  export const { clear } = foodCatalogSlice.actions;
  export const selectResults = (state: RootState) => state.foodCatalog.results;
  export default foodCatalogSlice.reducer;