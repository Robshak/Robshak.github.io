import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";
import { Track } from "../../interfaces/Track.interface";
import { Tag } from "../../interfaces/tag.interface";

export const TAGLISTONTRACK_MANAGER_PERSISTENT_STATE = "taglist-on-track";

export interface TaglistOnTrackStatePersistentState {
    tracks: Track[];
}

export interface TaglistOnTrackState {
    tracks: Track[];
}

const initialState: TaglistOnTrackState = {
    tracks: loadState<TaglistOnTrackStatePersistentState>(TAGLISTONTRACK_MANAGER_PERSISTENT_STATE)?.tracks ?? []
};

// Slice for storing tracks with tags and storing tags on these tracks
export const taglistOnTrackStateSlice = createSlice({
    name: "taglistOnTrack",
    initialState,
    reducers: {
        setOnTrack: (state, action: PayloadAction<{ track: Track, tags: Tag[] }>) => { // assign a set of tags to the track
            state.tracks = state.tracks.filter(tr => tr.id != action.payload.track.id);
            state.tracks.push({ ...action.payload.track, tags: action.payload.tags });
        },
        addTagOnTrack: (state, action: PayloadAction<{ track: Track, tag: Tag }>) => { // add a tag to the track
            const needTrack = state.tracks.find(tr => tr.id == action.payload.track.id);
            if (!needTrack) {
                const newTrack = { ...action.payload.track, tags: [] } as Track;
                newTrack.tags.push(action.payload.tag);
                state.tracks.push(newTrack);
            }
            else {
                state.tracks = state.tracks.filter(tr => tr.id != needTrack.id);
                if (!needTrack.tags.find(tg => tg.name == action.payload.tag.name)) {
                    needTrack.tags.push(action.payload.tag);
                }
                state.tracks.push(needTrack);
            }
        },
        deleteTagOnTrack: (state, action: PayloadAction<{ track: Track, tag: Tag }>) => { // delete a tag from the track
            const needTrack = state.tracks.find(tr => tr.id == action.payload.track.id);
            if (!needTrack) {
                return;
            }
            // console.log(needTrack);
            state.tracks = state.tracks.filter(tr => tr.id != needTrack.id);
            if (needTrack.tags.length > 1) {
                needTrack.tags = needTrack.tags.filter(tg => tg.name != action.payload.tag.name);
                state.tracks.push(needTrack);
            }
        },
        deleteTagOnAllTracks: (state, action: PayloadAction<Tag>) => { // delete a tag from all tracks
            state.tracks = state.tracks.map(tr => {
                tr.tags = tr.tags.filter(tg => tg.name != action.payload.name);
                return tr;
            });
            state.tracks = state.tracks.filter(tr => tr.tags.length);
        },
        editTagOnAllTracks: (state, action: PayloadAction<{ tagName: string, newValue: Tag }>) => { // edit a tag on all tracks
            state.tracks = state.tracks.map(tr => {
                tr.tags = tr.tags.map(tg => {
                    if (tg.name == action.payload.tagName) {
                        tg = action.payload.newValue;
                    }
                    return tg;
                });
                return tr;
            });
        }
    }
});

export default taglistOnTrackStateSlice.reducer;
export const taglistOnTrackStateActions = taglistOnTrackStateSlice.actions;