import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allorder: [],
  particularOrder: {},

};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    storeallorder: (state, action) => {
      state.allorder = action.payload;
    },
    storeparticularOrder: (state, action) => {
      state.particularOrder = action.payload;
    },

  },
});

export const { storeallorder, storeparticularOrder } = orderSlice.actions;
export default orderSlice.reducer;
