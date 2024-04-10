import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Tag } from "../interfaces/tag.interface";

export const TAGLIST_PERSISTENT_STATE = "taglist";

export interface TaglistPersistentState {
    tags: Tag[] | null;
}

export interface TaglistState {
    tags: Tag[] | null;
}

const initialState: TaglistState = {
    tags: loadState<TaglistPersistentState>(TAGLIST_PERSISTENT_STATE)?.tags ?? null
};

export const taglistSlice = createSlice({
    name: "taglist",
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<Tag>) => {
            if (!state.tags?.find(t => t.name == action.payload.name)) {
                state.tags?.push(action.payload);
            }
        },
        delTag: (state, action: PayloadAction<string>) => {
            state.tags?.filter(t => t.name == action.payload);
        }
    }
});

export default taglistSlice.reducer;
export const taglistActions = taglistSlice.actions;