import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { loadState } from "../storage";

export const VOLUME_MANAGER_PERSISTENT_STATE = "volume-manager";

export interface VolumeManagerPersistentState {
    trueVolume: number;
    volume: number;
    mute: boolean;
}

export interface VolumeManagerState {
    trueVolume: number;
    volume: number;
    mute: boolean;
}

const initialState: VolumeManagerState = {
    trueVolume: loadState<VolumeManagerPersistentState>(VOLUME_MANAGER_PERSISTENT_STATE)?.trueVolume ?? 0.1,
    volume: loadState<VolumeManagerPersistentState>(VOLUME_MANAGER_PERSISTENT_STATE)?.volume ?? 0.1,
    mute: loadState<VolumeManagerPersistentState>(VOLUME_MANAGER_PERSISTENT_STATE)?.mute ?? false
};

// Slice for controlling the current volume
export const volumeManagerSlice = createSlice({
    name: "volumeManager",
    initialState,
    reducers: {
        setVolume: (state, action: PayloadAction<number>) => { // Set volume
            state.trueVolume = action.payload;
            state.volume = state.trueVolume;
            if (!state.trueVolume) {
                state.mute = true;
            }
            else {
                state.mute = false;
            }
        },
        setMute: (state) => { // Set mute
            if (!state.trueVolume) {
                state.trueVolume = 0.05;
                state.mute = false;
            }
            else {
                state.mute = !state.mute;
            }
            if (state.mute) {
                state.volume = 0;
            }
            else {
                state.volume = state.trueVolume;
            }
        }
    }
});

export default volumeManagerSlice.reducer;
export const volumeManagerActions = volumeManagerSlice.actions;