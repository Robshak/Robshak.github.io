import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Tag } from "../interfaces/tag.interface";

export const TAGLIST_PERSISTENT_STATE = "taglist";

export interface TaglistPersistentState {
    tags: Tag[] | null;
    currentId: number;
}

export interface TaglistState {
    tags: Tag[] | null;
    currentId: number;
}

const initialState: TaglistState = {
    tags: loadState<TaglistPersistentState>(TAGLIST_PERSISTENT_STATE)?.tags ?? null,
    currentId: loadState<TaglistPersistentState>(TAGLIST_PERSISTENT_STATE)?.currentId ?? 0
};

export const taglistSlice = createSlice({
    name: "taglist",
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<Tag>) => {
            action.payload.id = state.currentId;
            state.currentId++;
            state.tags?.push(action.payload);
        },
        delTag: (state, action: PayloadAction<number>) => {
            state.tags?.filter(t => t.id == action.payload);
        }
    }
});

export default taglistSlice.reducer;
export const taglistActions = taglistSlice.actions;