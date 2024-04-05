import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { loadState } from "./storage";
import { searchAPI } from "../workWithAPI/searchAPI";

export const PLAYLIST_PERSISTENT_STATE = "playlist";

export interface PlaylistPersistentState {
    playlist: string[] | null;
}

export interface PlaylistState {
    tracks: string[] | null;
    errorMessage?: string;
}

const initialState: PlaylistState = {
    tracks: loadState<PlaylistPersistentState>(PLAYLIST_PERSISTENT_STATE)?.playlist ?? null
};

export const getTracks = createAsyncThunk("playlist/tracks",
    async (params: { searchString: string }) => {
        try {
            const data: string[] | undefined = await searchAPI(params.searchString);
            return data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new Error(e.response?.data.message);
            }
        }
    }
);

export const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        clearState: (state) => {
            state.tracks = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTracks.fulfilled, (state, action) => {
            if (!action.payload) {
                return;
            }
            state.tracks = action.payload;
        });
        builder.addCase(getTracks.rejected, (state, action) => {
            state.errorMessage = action.error.message;
        });
    }
});

export default playlistSlice.reducer;
export const playlistActions = playlistSlice.actions;