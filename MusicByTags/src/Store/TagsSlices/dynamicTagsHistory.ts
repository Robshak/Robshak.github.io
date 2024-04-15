import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";
import { DynamicTag } from "../../interfaces/DynamicTag";

export const HISTORY_DYNAMICTAGS_PERSISTENT_STATE = "history-dynamic-tags";

export interface HistoryDynamicTagsPersistentState {
    historyDynamicTags: DynamicTag[][];
}

export interface HistoryDynamicTagsState {
    historyDynamicTags: DynamicTag[][];
}

const initialState: HistoryDynamicTagsState = {
    historyDynamicTags: loadState<HistoryDynamicTagsPersistentState>(HISTORY_DYNAMICTAGS_PERSISTENT_STATE)?.historyDynamicTags ?? []
};

// Slice for storing search history
export const HistoryDynamicTagsStateSlice = createSlice({
    name: "historyDynamicTags",
    initialState,
    reducers: {
        addDynamicTags: (state, action: PayloadAction<DynamicTag[]>) => { // Add a record
            if (!action.payload.length) {
                return;
            }
            state.historyDynamicTags = [action.payload].concat(state.historyDynamicTags);
            if (state.historyDynamicTags.length > 5) {
                state.historyDynamicTags.pop();
            }
        },
        delDynamicTags: (state, action: PayloadAction<number>) => { // Delete a record
            state.historyDynamicTags.splice(action.payload, 1);
        }
    }
});

export default HistoryDynamicTagsStateSlice.reducer;
export const HistoryDynamicTagsStateActions = HistoryDynamicTagsStateSlice.actions;