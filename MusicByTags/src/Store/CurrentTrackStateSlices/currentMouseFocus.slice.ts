import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ActiveManagerState {
    currentFocus: string;
}

const initialState: ActiveManagerState = {
    currentFocus: ""
};

// Slice for tracking which track currently has focus
export const CurrentFocusSlice = createSlice({
    name: "currentFocus",
    initialState,
    reducers: {
        setFocus: (state, action: PayloadAction<string>) => { // set focus
            state.currentFocus = action.payload;
        }
    }
});

export default CurrentFocusSlice.reducer;
export const currentFocusActions = CurrentFocusSlice.actions;