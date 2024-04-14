import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { List } from "../../interfaces/list.interface";
import { Track } from "../../interfaces/Track.interface";
import { loadState } from "../storage";
import { DynamicTag, defaultDynamicTags } from "../TagsSlices/currentDynamicTags";
import { Tag } from "../../interfaces/tag.interface";

export const PLAYER_PERSISTENT_STATE = "player";

const defaultLists: List[] = [
    {
        tracks: [],
        tags: []
    },
    {
        tracks: [],
        tags: defaultDynamicTags
    }
];

export interface PlayerPersistentState {
    lists: List[];
    currentTrack: Track | null;
    currentTags: DynamicTag[];
}

export interface PlayerState {
    lists: List[];
    currentTrack: Track | null;
    currentTags: DynamicTag[];
    errorMessage?: string;
}

const initialState: PlayerState = {
    lists: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.lists ?? defaultLists,
    currentTrack: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentTrack ?? null,
    currentTags: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentTags ?? []
};

export const CMPTags = (first: Tag[], second: Tag[]) => {
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

export const CMPDynamicTags = (first: DynamicTag[], second: DynamicTag[]) => {
    let equals = true;
    for (const tag of first) {
        if (!second.find(t => !CMPTags(tag.tags, t.tags))) {
            equals = false;
            break;
        }
    }
    if (first.length == 0 && second.length == 0) {
        equals = true;
    }
    else if (first.length == 0 || second.length == 0) {
        equals = false;
    }
    console.log(first.length, second.length, equals);
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
            // const tags: Tag[] = [
            //     {
            //         name: "-0",
            //         color: "#fff",
            //         private: true
            //     }
            // ];

            // let newTags = action.payload.tags;
            // newTags = newTags.concat([{ id: -1, tags }]);

            // action.payload = {
            //     tracks: action.payload.tracks,
            //     tags: newTags
            // };

            if (state.lists.find(l => CMPDynamicTags(l.tags, action.payload.tags))) {
                console.log(action.payload.tracks);
                state.lists = state.lists.map(list => {
                    if (CMPDynamicTags(action.payload.tags, list.tags)) {
                        list = action.payload;
                    }
                    return list;
                });
            }
            else {
                if (action.payload && !state.lists.find(list => {
                    return CMPDynamicTags(action.payload.tags, list.tags);
                })) {
                    console.log(action.payload);
                    state.lists = [action.payload].concat(state.lists);
                    console.log(state.lists.length);
                }
            }
            if (state.lists.length > 3) {
                state.lists.pop();
            }
        },
        deleteList: (state, action: PayloadAction<List>) => {
            if (action.payload) {
                state.lists.filter(list => {
                    return CMPDynamicTags(action.payload.tags, list.tags);
                });
            }
        },
        setTrack: (state, action: PayloadAction<{ track: Track, tags: DynamicTag[] }>) => {
            const newList = state.lists.find(l => CMPDynamicTags(l.tags, action.payload.tags));
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