import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { List } from "../interfaces/list.interface";
import { Tag } from "../interfaces/tag.interface";
import { Track } from "../interfaces/Track.interface";

export const PLAYER_PERSISTENT_STATE = "player";

export interface PlayerPersistentState {
    lists: List[];
    currentTrack: Track | null;
    currentTags: Tag[];
}

export interface PlayerState {
    lists: List[];
    currentTrack: Track | null;
    currentTags: Tag[];
    errorMessage?: string;
}

const initialState: PlayerState = {
    lists: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.lists ?? [],
    currentTrack: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentTrack ?? null,
    currentTags: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentTags ?? []
};

export const CMP = (first: Tag[], second: Tag[]) => {
    let equals = true;
    for (const tag of first) {
        if (!second.find(t => t.name == tag.name)) {
            equals = false;
            break;
        }
    }
    if (first.length == 0 && second.length == 0)
        equals = true;
    return equals;
};

export const PlayerSlice = createSlice({
    name: "player",
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
        setTrack: (state, action: PayloadAction<{ track: Track, tags: Tag[] }>) => {
            const newList = state.lists.find(l => CMP(l.tags, action.payload.tags));
            if (!newList) {
                return;
            }
            state.currentTrack = action.payload.track;
            state.currentTags = action.payload.tags;
        }
    }
});

export default PlayerSlice.reducer;
export const PlayerActions = PlayerSlice.actions;