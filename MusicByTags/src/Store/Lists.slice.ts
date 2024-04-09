import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { List } from "../interfaces/list.interface";
import { Tag } from "../interfaces/tag.interface";

export const LISTS_PERSISTENT_STATE = "lists";

export interface ListsPersistentState {
    lists: List[];
}

export interface ListsState {
    lists: List[];
    errorMessage?: string;
}

const initialState: ListsState = {
    lists: loadState<ListsPersistentState>(LISTS_PERSISTENT_STATE)?.lists ?? []
};

export const CMP = (first: Tag[], second: Tag[]) => {
    // console.log(first, second, first == second);
    if (first.length == 0 && second.length == 0)
        return true;
    return first == second;
};

export const listsSlice = createSlice({
    name: "lists",
    initialState,
    reducers: {
        pushList: (state, action: PayloadAction<List>) => {
            if (!action.payload) {
                return;
            }

            if (state.lists.find(l => CMP(l.tags, action.payload.tags))) {
                state.lists = state.lists.map(list => {
                    if (CMP(action.payload.tags, list.tags)) {
                        list = action.payload;
                    }
                    return list;
                });
            }
            else {
                if (action.payload && !state.lists.find(list => {
                    return CMP(action.payload.tags, list.tags);
                })) {
                    state.lists.push(action.payload);
                }
            }
        },
        deleteList: (state, action: PayloadAction<List>) => {
            if (action.payload) {
                state.lists.filter(list => {
                    return CMP(action.payload.tags, list.tags);
                });
            }
        }
    }
});

export default listsSlice.reducer;
export const ListsActions = listsSlice.actions;