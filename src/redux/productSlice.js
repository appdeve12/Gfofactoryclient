import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allproduct: null,
  particularproduct: {},

};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setallproduct: (state, action) => {
      state.allproduct = action.payload;
    },
    setparticularproduct: (state, action) => {
      state.particularproduct = action.payload;
    },
  
  },
});

export const { setallproduct, setparticularproduct } = productSlice.actions;
export default productSlice.reducer;
