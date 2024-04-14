import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { loadState } from "./storage";

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

export const ActiveManagerSlice = createSlice({
    name: "activeManager",
    initialState,
    reducers: {
        setActive: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
        toggleActive: (state) => {
            state.active = !state.active;
        }
    }
});

export default ActiveManagerSlice.reducer;
export const activeManagerActions = ActiveManagerSlice.actions;