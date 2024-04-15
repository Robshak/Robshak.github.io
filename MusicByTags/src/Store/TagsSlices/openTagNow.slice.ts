import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Tag } from "../../interfaces/tag.interface";


export interface OpenTagsNowState {
    tags: Tag[]
}

const initialState: OpenTagsNowState = {
    tags: []
};

// Slice for controlling which tags are currently active in the current tag set
export const openTagsNowStateSlice = createSlice({
    name: "taglistOnTrack",
    initialState,
    reducers: {
        clearState: (state) => { // Clear state
            state.tags = [];
        },
        setTags: (state, action: PayloadAction<Tag[]>) => { // Set tags
            state.tags = action.payload ?? [];
        },
        addTag: (state, action: PayloadAction<Tag>) => { // Add tag
            state.tags.push(action.payload);
        },
        deleteTag: (state, action: PayloadAction<Tag>) => { // delete tag
            state.tags = state.tags.filter(tg => tg.name != action.payload.name);
        }
    }
});

export default openTagsNowStateSlice.reducer;
export const openTagsNowStateActions = openTagsNowStateSlice.actions;