import { configureStore } from "@reduxjs/toolkit";
import { saveState } from "./storage";
import volumeManagerSlice, { VOLUME_MANAGER_PERSISTENT_STATE } from "./CurrentTrackStateSlices/volumeManage.slice";
import ActiveManagerSlice, { ACTIVE_MANAGER_PERSISTENT_STATE } from "./CurrentTrackStateSlices/activeManager.slice";
import tagListSlice, { TAGLIST_PERSISTENT_STATE } from "./TagsSlices/tagList.slice";
import playerManagerSlice, { PLAYER_PERSISTENT_STATE } from "./CurrentTrackStateSlices/playerManager.slice";
import currentMouseFocusSlice from "./CurrentTrackStateSlices/currentMouseFocus.slice";
import tagListOnTrackSlice, { TAGLISTONTRACK_MANAGER_PERSISTENT_STATE } from "./TagsSlices/tagListOnTrack..slice";
import openTagsNowStateSlice from "./TagsSlices/openTagNow.slice";
import currentDynamicTagsSlice, { CURRENT_DYNAMICTAGS_PERSISTENT_STATE } from "./TagsSlices/currentDynamicTags";
import historyDynamicTagsSlice, { HISTORY_DYNAMICTAGS_PERSISTENT_STATE } from "./TagsSlices/dynamicTagsHistory";

export const store = configureStore({
    reducer: {
        volumeManager: volumeManagerSlice,
        activeManager: ActiveManagerSlice,
        tagList: tagListSlice,
        player: playerManagerSlice,
        currentFocus: currentMouseFocusSlice,
        taglistOnTrack: tagListOnTrackSlice,
        openTagsNow: openTagsNowStateSlice,
        currentDynamicTags: currentDynamicTagsSlice,
        historyDynamicTags: historyDynamicTagsSlice
    }
});

store.subscribe(() => {
    saveState(VOLUME_MANAGER_PERSISTENT_STATE, { ...store.getState().volumeManager });
    saveState(ACTIVE_MANAGER_PERSISTENT_STATE, { ...store.getState().activeManager });
    saveState(TAGLIST_PERSISTENT_STATE, { ...store.getState().tagList });
    saveState(PLAYER_PERSISTENT_STATE, { ...store.getState().player });
    saveState(TAGLISTONTRACK_MANAGER_PERSISTENT_STATE, { ...store.getState().taglistOnTrack });
    saveState(CURRENT_DYNAMICTAGS_PERSISTENT_STATE, { ...store.getState().currentDynamicTags });
    saveState(HISTORY_DYNAMICTAGS_PERSISTENT_STATE, { ...store.getState().historyDynamicTags });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;