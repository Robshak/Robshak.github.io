import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { List } from "../interfaces/list.interface";
import { Tag } from "../interfaces/tag.interface";
import { currentTrackActions } from "./currentTrack.slice";

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
        },
        moveTrack: (state, action: PayloadAction<{ oldId: number, newId: number, tags: Tag[] }>) => {
            const list = state.lists.find(l => CMP(l.tags, action.payload.tags));
            if (!list || action.payload.oldId == action.payload.newId) {
                return;
            }
            const plus = (action.payload.oldId > action.payload.newId ? 1 : -1);
            list.tracks = list.tracks.map(track => {
                if (!track) {
                    return track;
                }
                if (track.number == action.payload.oldId) {
                    track.number = action.payload.newId;
                }
                else if (Math.min(action.payload.oldId, action.payload.newId) <= track.number &&
                    track.number <= Math.max(action.payload.oldId, action.payload.newId)) {
                    track.number += plus;
                }
                return track;
            });
            // combineReducers();
            // ListsActions.pushList(list);
            state.lists = state.lists.map(l => {
                if (CMP(action.payload.tags, l.tags)) {
                    l = list;
                }
                return l;
            });
        },
        getPrevNextTrack: (state, action: PayloadAction<{ tags: Tag[], id: string | undefined, isNext: boolean }>) => {
            if (!action.payload.id) {
                return;
            }
            const list = state.lists.find(l => CMP(l.tags, action.payload.tags));
            const plus = (action.payload.isNext ? 1 : -1);
            if (!list) {
                return;
            }
            const currentTrack = list.tracks.find(t => t.id == action.payload.id);
            if (!currentTrack) {
                return;
            }
            let currentId = currentTrack.number + plus;
            if (currentId < 0) {
                currentId = 0;
            }
            if (currentId >= list.tracks.length) {
                currentId = list.tracks.length;
            }
            const resTrack = list.tracks.find(t => t.number === currentId);
            if (!resTrack) {
                return;
            }
            currentTrackActions.setTrack({ track: resTrack, listTags: list.tags });
        }
    }
});

export default listsSlice.reducer;
export const ListsActions = listsSlice.actions;