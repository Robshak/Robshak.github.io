import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Track } from "../interfaces/Track.interface";

export const CURRENT_TRACK_PERSISTENT_STATE = "current-track";

export interface CurrentTrack {
    url: string;
    name: string;
    artists: string;
    img: string;
    tags: string[] | undefined;
}

export interface CurrentTrackPersistentState {
    track: CurrentTrack;
    active: boolean;
    volume: number;
    currentPosition: number;
    len_ms: number | null;
    cycle: boolean;
}

export interface CurrentTracktState {
    track: CurrentTrack | undefined;
    active: boolean;
    volume: number;
    currentPosition: number;
    len_ms: number | null;
    cycle: boolean;
}

const initialState: CurrentTracktState = {
    track: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.track ?? undefined,
    active: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.active ?? false,
    volume: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.volume ?? 0.1,
    currentPosition: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.currentPosition ?? 0,
    len_ms: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.len_ms ?? null,
    cycle: false
};

export const currentTrackSlice = createSlice({
    name: "currentTrack",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<Track>) => {
            if (action.payload.previewUrl) {
                state.track = {
                    url: action.payload.previewUrl,
                    name: action.payload.name,
                    artists: action.payload.artists,
                    img: action.payload.img,
                    tags: action.payload.tags
                };
                state.len_ms = action.payload.durationMs;
                state.currentPosition = 0;
                state.active = true;
            }
        },
        playPauseTrack: (state) => {
            state.active = !state.active;
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload;
        },
        changeCycle: (state) => {
            state.cycle = !state.cycle;
        },
        setPosition: (state, action: PayloadAction<number>) => {
            state.currentPosition = action.payload;
        },
        loadTrack: (state) => {
            state.track = loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.track ?? undefined;
            console.log(state);
        }
    }
});

export default currentTrackSlice.reducer;
export const currentTrackActions = currentTrackSlice.actions;