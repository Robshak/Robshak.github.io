import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Track } from "../../interfaces/Track.interface";
import { loadState } from "../storage";

export const PLAYER_PERSISTENT_STATE = "player";
export interface PlayerPersistentState {
    currentTrack: Track | null;
    currentList: Track[];
    searchtList: Track[];
    createList: Track[];
}

export interface PlayerState {
    currentTrack: Track | null;
    currentList: Track[];
    searchtList: Track[];
    createList: Track[];
    errorMessage?: string;
}

const initialState: PlayerState = {
    currentTrack: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentTrack ?? null,
    currentList: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.currentList ?? [],
    searchtList: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.searchtList ?? [],
    createList: loadState<PlayerPersistentState>(PLAYER_PERSISTENT_STATE)?.createList ?? []
};

export const PlayerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<Track>) => {
            state.currentTrack = action.payload;
        },
        setCurrentList: (state, action: PayloadAction<Track[]>) => {
            state.currentList = action.payload;
        },
        setSearchList: (state, action: PayloadAction<Track[]>) => {
            state.searchtList = action.payload;
        },
        setCreateList: (state, action: PayloadAction<Track[]>) => {
            state.createList = action.payload;
        }
    }
});

export default PlayerSlice.reducer;
export const PlayerActions = PlayerSlice.actions;