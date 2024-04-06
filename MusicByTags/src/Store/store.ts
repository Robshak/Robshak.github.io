import { configureStore } from "@reduxjs/toolkit";
import { saveState } from "./storage";
import currentTrackSlice, { CURRENT_TRACK_PERSISTENT_STATE } from "./currentTrack.slice";
import searchlistSlice, { SEARCHLIST_PERSISTENT_STATE } from "./searchlist.slice";

export const store = configureStore({
    reducer: {
        searchlist: searchlistSlice,
        currentTrack: currentTrackSlice
    }
});

store.subscribe(() => {
    saveState(SEARCHLIST_PERSISTENT_STATE, { playlist: store.getState().searchlist.tracks });
    saveState(CURRENT_TRACK_PERSISTENT_STATE, { ...store.getState().currentTrack });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;