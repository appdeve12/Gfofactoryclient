import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  storeone: {},
 

};

const StockInSlice = createSlice({
  name: 'stockin',
  initialState,
  reducers: {
    storeparticularstockin: (state, action) => {
      state.storeone = action.payload;
    },
   
  
  },
});

export const { storeparticularstockin } = StockInSlice.actions;
export default StockInSlice.reducer;
