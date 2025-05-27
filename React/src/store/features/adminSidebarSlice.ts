import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const adminSidebarSlice = createSlice({
  name: "adminSidebar",
  initialState: {
    sidebar: "products", 
  },
  reducers: {
    setSidebar: (state, action: PayloadAction<string>) => {
      state.sidebar = action.payload;
    },
  },
});

export const { setSidebar } = adminSidebarSlice.actions;
export default adminSidebarSlice.reducer;