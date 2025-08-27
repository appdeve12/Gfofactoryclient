import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allbrand: [],
  allapprovedbrand: [],

};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    storeallbrand: (state, action) => {
      state.allbrand = action.payload;
    },
    storeallapprovedbrand: (state, action) => {
      state.allapprovedbrand = action.payload;
    },

  },
});

export const { storeallbrand, storeallapprovedbrand } = brandSlice.actions;
export default brandSlice.reducer;
