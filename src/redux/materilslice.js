import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allmaterial: [],


};

const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    storeallmaterial: (state, action) => {
      state.allmaterial = action.payload;
    },
   
  },
});

export const { storeallmaterial } = materialSlice.actions;
export default materialSlice.reducer;
