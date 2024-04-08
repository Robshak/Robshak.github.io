import { configureStore } from "@reduxjs/toolkit";
import { saveState } from "./storage";
import currentTrackSlice, { CURRENT_TRACK_PERSISTENT_STATE } from "./currentTrack.slice";
import listsSlice, { LISTS_PERSISTENT_STATE } from "./Lists.slice";
import volumeManagerSlice, { VOLUME_MANAGER_PERSISTENT_STATE } from "./volumeManage.slice";
import ActiveManagerSlice, { ACTIVE_MANAGER_PERSISTENT_STATE } from "./activeManager.slice";
import tagListSlice, { TAGLIST_PERSISTENT_STATE } from "./tagList.slice";

export const store = configureStore({
    reducer: {
        lists: listsSlice,
        currentTrack: currentTrackSlice,
        volumeManager: volumeManagerSlice,
        activeManager: ActiveManagerSlice,
        tagList: tagListSlice
    }
});

store.subscribe(() => {
    saveState(LISTS_PERSISTENT_STATE, { ...store.getState().lists });
    saveState(CURRENT_TRACK_PERSISTENT_STATE, { ...store.getState().currentTrack });
    saveState(VOLUME_MANAGER_PERSISTENT_STATE, { ...store.getState().volumeManager });
    saveState(ACTIVE_MANAGER_PERSISTENT_STATE, { ...store.getState().activeManager });
    saveState(TAGLIST_PERSISTENT_STATE, { ...store.getState().tagList });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;