import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ActiveManagerState {
    currentFocus: string;
}

const initialState: ActiveManagerState = {
    currentFocus: ""
};

export const CurrentFocusSlice = createSlice({
    name: "currentFocus",
    initialState,
    reducers: {
        setFocus: (state, action: PayloadAction<string>) => {
            state.currentFocus = action.payload;
        }
    }
});

export default CurrentFocusSlice.reducer;
export const currentFocusActions = CurrentFocusSlice.actions;