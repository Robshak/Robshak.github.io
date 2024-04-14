import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";
import { Tag } from "../../interfaces/tag.interface";
import { defaultTags } from "./tagList.slice";

export const CURRENT_DYNAMICTAGS_PERSISTENT_STATE = "current-dynamic-tags";

export const defaultDynamicTags: DynamicTag[] = [
    {
        id: 1,
        tags: defaultTags
    }
];

export interface DynamicTag {
    id: number;
    tags: Tag[];
}

export interface CurrentDynamicTagsPersistentState {
    currentId: number;
    dynamicTags: DynamicTag[];
}

export interface CurrentDynamicTagsState {
    currentId: number;
    dynamicTags: DynamicTag[];
}

const initialState: CurrentDynamicTagsState = {
    dynamicTags: loadState<CurrentDynamicTagsPersistentState>(CURRENT_DYNAMICTAGS_PERSISTENT_STATE)?.dynamicTags ?? defaultDynamicTags,
    currentId: loadState<CurrentDynamicTagsPersistentState>(CURRENT_DYNAMICTAGS_PERSISTENT_STATE)?.currentId ?? 2
};

const getDynamicTag = (dynamicTags: DynamicTag[], dynamicTagId: number) => {
    return dynamicTags.find(dtg => dtg.id == dynamicTagId);
};

const updateState = (dynamicTags: DynamicTag[], newVal: DynamicTag) => {
    if (dynamicTags.find(dtg => dtg.id == newVal.id)) {
        dynamicTags = dynamicTags.map(dtg => {
            if (dtg.id == newVal.id) {
                dtg.tags = newVal.tags;
            }
            return dtg;
        });
    }
    else {
        dynamicTags.push(newVal);
    }
    if (dynamicTags.length > 10) {
        dynamicTags.splice(0, 1);
    }
    return dynamicTags;
};

export const CurrentDynamicTagsStateSlice = createSlice({
    name: "currentDynamicTags",
    initialState,
    reducers: {
        setDynamicTags: (state, action: PayloadAction<DynamicTag[]>) => {
            if (!action.payload.length) {
                return;
            }
            state.dynamicTags = action.payload;
        },
        setDynamicTag: (state, action: PayloadAction<{ id: number, tags: Tag[] }>) => {
            if (!action.payload.tags.length) {
                state.dynamicTags = state.dynamicTags.filter(dtg => dtg.id != action.payload.id);
                return;
            }
            let dynamicTag = getDynamicTag(state.dynamicTags, action.payload.id);
            if (!dynamicTag) {
                return;
            }
            dynamicTag = {
                id: action.payload.id,
                tags: action.payload.tags
            };
            state.dynamicTags = updateState(state.dynamicTags, dynamicTag);
        },
        addTagOnDynamicTag: (state, action: PayloadAction<{ id: number, tag: Tag }>) => {
            const dynamicTag = getDynamicTag(state.dynamicTags, action.payload.id);
            if (!dynamicTag) {
                return;
            }
            dynamicTag.tags.push(action.payload.tag);
            state.dynamicTags = updateState(state.dynamicTags, dynamicTag);
        },
        deleteTagOnDynamicTag: (state, action: PayloadAction<{ id: number, tag: Tag }>) => {
            let dynamicTag = getDynamicTag(state.dynamicTags, action.payload.id);
            if (!dynamicTag) {
                return;
            }
            dynamicTag = {
                id: action.payload.id,
                tags: dynamicTag.tags.filter(tg => tg.name != action.payload.tag.name)
            };
            state.dynamicTags = updateState(state.dynamicTags, dynamicTag);
        },
        addDynamicTag: (state, action: PayloadAction<Tag[]>) => {
            if (!action.payload.length) {
                return;
            }
            const newDynamicTag: DynamicTag = {
                tags: action.payload,
                id: state.currentId
            };
            state.currentId++;
            state.dynamicTags.push(newDynamicTag);
        },
        deleteDynamicTag: (state, action: PayloadAction<DynamicTag>) => {
            state.dynamicTags = state.dynamicTags.filter(dtg => dtg.id != action.payload.id);
        },
        clear: (state) => {
            state.currentId = 1;
            state.dynamicTags = [];
        }
    }
});

export default CurrentDynamicTagsStateSlice.reducer;
export const CurrentDynamicTagsStateActions = CurrentDynamicTagsStateSlice.actions;