import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { loadState } from "./storage";
import { searchAPI } from "../workWithAPI/searchAPI";
import { Track } from "../interfaces/Track.interface";

export const SEARCHLIST_PERSISTENT_STATE = "searchlist";

export interface SearchlistPersistentState {
    playlist: (Track | undefined)[] | null;
}

export interface SearchlistState {
    tracks: (Track | undefined)[] | null;
    errorMessage?: string;
}

const initialState: SearchlistState = {
    tracks: loadState<SearchlistPersistentState>(SEARCHLIST_PERSISTENT_STATE)?.playlist ?? null
};

export const getTracks = createAsyncThunk("searchlist/tracks",
    async (params: { searchString: string }) => {
        try {
            const data: (Track | undefined)[] | undefined = await searchAPI(params.searchString);
            return data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new Error(e.response?.data.message);
            }
        }
    }
);

export const searchlistSlice = createSlice({
    name: "searchlist",
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

export default searchlistSlice.reducer;
export const searchlistActions = searchlistSlice.actions;