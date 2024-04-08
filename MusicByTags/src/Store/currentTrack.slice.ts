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
    len_s: number | null;
    tracks: (Track | undefined)[] | null;
    id: number;
}

export interface CurrentTrackState {
    track: CurrentTrack | undefined;
    len_s: number | null;
    tracks: (Track | undefined)[] | null;
    id: number;
}

const initialState: CurrentTrackState = {
    track: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.track ?? undefined,
    len_s: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.len_s ?? null,
    tracks: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.tracks ?? null,
    id: -1
};

const converTrackType = (track: Track | undefined): CurrentTrack | undefined => {
    if (!track) {
        return undefined;
    }
    const res: CurrentTrack = {
        url: track.previewUrl,
        name: track.name,
        artists: track.artists,
        img: track.img,
        tags: track.tags
    };

    return res;
};

const findTrack = (playlist: (Track | undefined)[], id: number): CurrentTrack | undefined => {
    const res: Track | undefined = playlist.find(t => {
        return t?.number == id;
    });
    return converTrackType(res);
};

export const currentTrackSlice = createSlice({
    name: "currentTrack",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<{
            playlist: (Track | undefined)[] | null,
            track: Track
        }>) => {
            if (action.payload.track.previewUrl) {
                state.track = converTrackType(action.payload.track);
                state.len_s = Math.ceil(action.payload.track.durationMs / 1000);
                state.id = action.payload.track.number;
                state.tracks = action.payload.playlist;
            }
        },
        prevTrack: (state) => {
            state.id--;
            if (state.tracks) {
                const newTrack = findTrack(state.tracks, state.id);
                if (newTrack) {
                    state.track = newTrack;
                }
                else {
                    state.id++;
                }
            }
        },
        nextTrack: (state) => {
            state.id++;
            if (state.tracks) {
                const newTrack = findTrack(state.tracks, state.id);
                if (newTrack) {
                    state.track = newTrack;
                }
                else {
                    state.track = findTrack(state.tracks, 0);
                    state.id = 0;
                }
            }
        },
        setTrackId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
            if (state.tracks) {
                state.track = findTrack(state.tracks, state.id);
            }
        },
        moveTrack: (state, action: PayloadAction<{ oldId: number, newId: number }>) => {
            if (!state.tracks || action.payload.oldId == action.payload.newId) {
                return;
            }
            const plus = (action.payload.oldId > action.payload.newId ? 1 : -1);
            state.tracks = state.tracks.map(track => {
                if (!track) {
                    return;
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
        }
    }
});

export default currentTrackSlice.reducer;
export const currentTrackActions = currentTrackSlice.actions;