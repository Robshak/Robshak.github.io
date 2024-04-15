import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";
import { Tag } from "../../interfaces/tag.interface";

export const TAGLIST_PERSISTENT_STATE = "taglist";

export const defaultTags: Tag[] = [
    {
        name: "Like",
        color: "#51BA4A",
        private: false
    }
];

export interface TaglistPersistentState {
    tags: Tag[];
}

export interface TaglistState {
    tags: Tag[];
}

const initialState: TaglistState = {
    tags: loadState<TaglistPersistentState>(TAGLIST_PERSISTENT_STATE)?.tags ?? defaultTags
};

// Slice for storing the current list of tags
export const taglistSlice = createSlice({
    name: "taglist",
    initialState,
    reducers: {
        addTag: (state, action: PayloadAction<Tag>) => { // Add tag
            if (!action.payload.name || !action.payload.color) {
                return;
            }
            if (!state.tags.find(t => t.name == action.payload.name)) {
                const newState = [...state.tags];
                newState.push(action.payload);
                state.tags = newState;
            }
        },
        deleteTag: (state, action: PayloadAction<string>) => { // Delete tag
            state.tags = state.tags.filter(t => t.name != action.payload);
        },
        editTag: (state, action: PayloadAction<{ tagName: string, newValue: Tag }>) => { // Edit tag
            state.tags = state.tags.map(tg => {
                if (action.payload.tagName == tg.name) {
                    tg = action.payload.newValue;
                }
                return tg;
            });
        }
    }
});

export default taglistSlice.reducer;
export const taglistActions = taglistSlice.actions;