import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "./storage";
import { Track } from "../interfaces/Track.interface";
import { Tag } from "../interfaces/tag.interface";

export const CURRENT_TRACK_PERSISTENT_STATE = "current-track";

export interface CurrentTrack {
    id: string;
    url: string;
    name: string;
    artists: string;
    img: string;
    trackTags: Tag[];
    next?: Track;
    prev?: Track;
}

export interface CurrentTrackPersistentState {
    track: CurrentTrack;
    len_s: number | null;
    tags: Tag[];
}

export interface CurrentTrackState {
    track: CurrentTrack | undefined;
    len_s: number | null;
    tags: Tag[];
}

const initialState: CurrentTrackState = {
    track: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.track ?? undefined,
    len_s: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.len_s ?? null,
    tags: loadState<CurrentTrackPersistentState>(CURRENT_TRACK_PERSISTENT_STATE)?.tags ?? []

};

const converTrackType = (track: Track | undefined): CurrentTrack | undefined => {
    if (!track) {
        return undefined;
    }
    const res: CurrentTrack = {
        id: track.id,
        url: track.previewUrl,
        name: track.name,
        artists: track.artists,
        img: track.img,
        trackTags: track.tags,
        next: track.next,
        prev: track.prev
    };

    return res;
};

export const currentTrackSlice = createSlice({
    name: "currentTrack",
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<{ track: Track, listTags: Tag[] }>) => {
            if (action.payload.track.previewUrl) {
                state.track = converTrackType(action.payload.track);
                state.len_s = Math.ceil(action.payload.track.durationMs / 1000);
                state.tags = action.payload.listTags;
            }
        }
    }
});

export default currentTrackSlice.reducer;
export const currentTrackActions = currentTrackSlice.actions;