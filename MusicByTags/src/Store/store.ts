import { configureStore } from "@reduxjs/toolkit";
import { saveState } from "./storage";
import listsSlice, { LISTS_PERSISTENT_STATE } from "./Lists.slice";
import volumeManagerSlice, { VOLUME_MANAGER_PERSISTENT_STATE } from "./volumeManage.slice";
import ActiveManagerSlice, { ACTIVE_MANAGER_PERSISTENT_STATE } from "./activeManager.slice";
import tagListSlice, { TAGLIST_PERSISTENT_STATE } from "./tagList.slice";
import playerManagerSlice, { PLAYER_PERSISTENT_STATE } from "./playerManager.slice";

export const store = configureStore({
    reducer: {
        lists: listsSlice,
        volumeManager: volumeManagerSlice,
        activeManager: ActiveManagerSlice,
        tagList: tagListSlice,
        player: playerManagerSlice
    }
});

store.subscribe(() => {
    saveState(LISTS_PERSISTENT_STATE, { ...store.getState().lists });
    saveState(VOLUME_MANAGER_PERSISTENT_STATE, { ...store.getState().volumeManager });
    saveState(ACTIVE_MANAGER_PERSISTENT_STATE, { ...store.getState().activeManager });
    saveState(TAGLIST_PERSISTENT_STATE, { ...store.getState().tagList });
    saveState(PLAYER_PERSISTENT_STATE, { ...store.getState().player });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;