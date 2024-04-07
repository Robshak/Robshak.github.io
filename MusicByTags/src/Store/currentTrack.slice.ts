import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Track } from "../interfaces/Track.interface";

export const CURRENT_TRACK_PERSISTENT_STATE = "current-track";

export interface CurrentTrack {
    url: string;
    number: number;
    name: string;
    artists: string;
    img: string;
    tags: string[] | undefined;
}

export interface CurrentTrackPersistentState {
    track: CurrentTrack;
    len_s: number | null;
    active: boolean;
}

export interface CurrentTrackState {
    track: CurrentTrack | undefined;
    len_s: number | null;
    active: boolean;
}

const initialState: CurrentTrackState = {
    track: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.track ?? undefined,
    len_s: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.len_s ?? null,
    active: false
};

export const currentTrackSlice = createSlice({
    name: "currentTrack",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<Track>) => {
            if (state.track?.number) {
                if (state.track.number == action.payload.number) {
                    state.active = !state.active;
                    return;
                }
            }
            if (action.payload.previewUrl) {
                state.track = {
                    url: action.payload.previewUrl,
                    number: action.payload.number,
                    name: action.payload.name,
                    artists: action.payload.artists,
                    img: action.payload.img,
                    tags: action.payload.tags
                };
                state.len_s = Math.ceil(action.payload.durationMs / 1000);
                state.active = true;
            }
        },
        setActive: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload;
        },
        toggleActive: (state) => {
            state.active = !state.active;
        }
    }
});

export default currentTrackSlice.reducer;
export const currentTrackActions = currentTrackSlice.actions;