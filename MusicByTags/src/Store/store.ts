import { configureStore } from "@reduxjs/toolkit";
import playlistSlice, { PLAYLIST_PERSISTENT_STATE } from "./playlist.slice";
import { saveState } from "./storage";

export const store = configureStore({
    reducer: {
        playlist: playlistSlice
    }
});

store.subscribe(() => {
    saveState(PLAYLIST_PERSISTENT_STATE, { playlist: store.getState().playlist.tracks });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;