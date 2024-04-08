import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Track } from "../interfaces/Track.interface";
import { CurrentTrack, CurrentTrackPersistentState, CurrentTrackState } from "./currentTrack.slice";

export const CURRENT_TRACK_PERSISTENT_STATE = "current-track";

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
        }
    }
});

export default currentTrackSlice.reducer;
export const currentTrackActions = currentTrackSlice.actions;