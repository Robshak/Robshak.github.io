import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";
import { DynamicTag } from "./currentDynamicTags";

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

export const HistoryDynamicTagsStateSlice = createSlice({
    name: "historyDynamicTags",
    initialState,
    reducers: {
        addDynamicTags: (state, action: PayloadAction<DynamicTag[]>) => {
            if (!action.payload.length) {
                return;
            }
            state.historyDynamicTags = [action.payload].concat(state.historyDynamicTags);
            if (state.historyDynamicTags.length > 5) {
                state.historyDynamicTags.pop();
            }
        },
        delDynamicTags: (state, action: PayloadAction<number>) => {
            state.historyDynamicTags.splice(action.payload, 1);
        }
    }
});

export default HistoryDynamicTagsStateSlice.reducer;
export const HistoryDynamicTagsStateActions = HistoryDynamicTagsStateSlice.actions;