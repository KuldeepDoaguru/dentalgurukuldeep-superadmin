// reducers/branchReducer.js
import { createReducer } from "@reduxjs/toolkit";
import { setBranch } from "../slices/BranchSlicer";

const initialState = { name: null };

// Create a reducer using createReducer from Redux Toolkit
export const branchReducer = createReducer(initialState, (builder) => {
  console.log("Initial branch State:", initialState);
  builder.addCase(setBranch, (state, action) => {
    state.name = action.payload.name;
    console.log("Branch State after setBranch:", state);
    console.log("Branch action after setBranch:", action.payload);
  });
  // console.log(initialState);
});
