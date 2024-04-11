import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Tag } from "../interfaces/tag.interface";

export const TAGLIST_PERSISTENT_STATE = "taglist";

export interface TaglistPersistentState {
    tags: Tag[];
}

export interface TaglistState {
    tags: Tag[];
}

const initialState: TaglistState = {
    tags: loadState<TaglistPersistentState>(TAGLIST_PERSISTENT_STATE)?.tags ?? []
};

export const taglistSlice = createSlice({
    name: "taglist",
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<Tag>) => {
            if (!action.payload.name || !action.payload.color) {
                return;
            }
            if (!state.tags.find(t => t.name == action.payload.name)) {
                const newState = [...state.tags];
                newState.push(action.payload);
                state.tags = newState;
            }
        },
        delTag: (state, action: PayloadAction<string>) => {
            state.tags = state.tags.filter(t => t.name == action.payload);
        }
    }
});

export default taglistSlice.reducer;
export const taglistActions = taglistSlice.actions;