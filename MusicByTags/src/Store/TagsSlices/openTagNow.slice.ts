import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Tag } from "../../interfaces/tag.interface";


export interface OpenTagsNowState {
    tags: Tag[]
}

const initialState: OpenTagsNowState = {
    tags: []
};

export const openTagsNowStateSlice = createSlice({
    name: "taglistOnTrack",
    initialState,
    reducers: {
        clearState: (state) => {
            state.tags = [];
        },
        setTags: (state, action: PayloadAction<Tag[]>) => {
            state.tags = action.payload ?? [];
        },
        addTag: (state, action: PayloadAction<Tag>) => {
            state.tags.push(action.payload);
        },
        delTag: (state, action: PayloadAction<Tag>) => {
            state.tags = state.tags.filter(tg => tg.name != action.payload.name);
        }
    }
});

export default openTagsNowStateSlice.reducer;
export const openTagsNowStateActions = openTagsNowStateSlice.actions;