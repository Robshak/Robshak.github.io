import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const ACTIVE_MANAGER_PERSISTENT_STATE = "active-manager";

export interface ActiveManagerPersistentState {
    active: boolean;
}

export interface ActiveManagerState {
    active: boolean;
}

const initialState: ActiveManagerState = {
    active: false
};

// Slice for controlling the state of the current track
export const ActiveManagerSlice = createSlice({
    name: "activeManager",
    initialState,
    reducers: {
        setActive: (state, action: PayloadAction<boolean>) => { // set a specific value
            state.active = action.payload;
        },
        toggleActive: (state) => { // toggle the value to its opposite
            state.active = !state.active;
        }
    }
});

export default ActiveManagerSlice.reducer;
export const activeManagerActions = ActiveManagerSlice.actions;