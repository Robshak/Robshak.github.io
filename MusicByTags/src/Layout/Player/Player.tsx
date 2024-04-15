import { useDispatch, useSelector } from "react-redux";
import styles from "./Player.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { durationToText } from "../../workWithAPI/getTracks";
import { Outlet } from "react-router-dom";
import { volumeManagerActions } from "../../Store/CurrentTrackStateSlices/volumeManage.slice";
import { activeManagerActions } from "../../Store/CurrentTrackStateSlices/activeManager.slice";
import { PlayerActions } from "../../Store/CurrentTrackStateSlices/playerManager.slice";
import { currentFocusActions } from "../../Store/CurrentTrackStateSlices/currentMouseFocus.slice";
import Popup from "reactjs-popup";
import Taglist from "../../Components/Tags/Taglist/Taglist";

// Colors for painting the progress bar
const PRIMARY_COLOR = "F178B6";
const WHITE_COLOR = "fff";

// Object - everything about the current playback
function Player() {
    const dispatch = useDispatch<AppDispatch>();
    const [progressBarColor, setProgressBarColor] = useState<string>(WHITE_COLOR);
    const [volumeBarColor, setVolumeBarColor] = useState<string>(WHITE_COLOR);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [needUpdateProgressBar, setNeedUpdateProgressBar] = useState<boolean>(true);
    const [cycleState, setCycleState] = useState<boolean>(false);
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const { currentList } = useSelector((s: RootState) => s.player);
    const volumeManager = useSelector((s: RootState) => s.volumeManager);
    const activeManager = useSelector((s: RootState) => s.activeManager);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    const trackWithTags = tracks.find(tr => tr.id == currentTrack?.id) ?? currentTrack;

    // start the audio player
    const audioPlayer = useRef<HTMLAudioElement>(null);

    // if some track is playing - set it up
    useEffect(() => {
        if (currentTrack && audioPlayer.current) {
            audioPlayer.current.src = currentTrack.previewUrl;
        }
    }, [currentTrack, audioPlayer]);

    // apply the necessary volume
    useEffect(() => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = volumeManager.volume;
        }
    }, [volumeManager.volume, audioPlayer]);

    // apply the necessary state - play / pause
    useEffect(() => {
        if (audioPlayer.current && activeManager.active) {
            audioPlayer.current.play();
        }
        else if (audioPlayer.current) {
            audioPlayer.current.pause();
        }
    });

    // change the current state
    const playTrack = () => {
        dispatch(activeManagerActions.toggleActive());
    };

    // support for progress bar depending on user actions
    const changeProgressBar = (e: any) => {
        if (audioPlayer.current) {
            if (needUpdateProgressBar) {
                audioPlayer.current.currentTime = e.target.value / 100;
            }
            setCurrentPosition(e.target.value);
        }
    };

    // support for progress bar depending on the listened part
    const updateProgressBar = (e: any) => {
        if (needUpdateProgressBar) {
            setCurrentPosition(e.target.currentTime * 100);
        }
    };

    // color the progress bar on hover
    const progressBarHover = () => {
        setProgressBarColor(PRIMARY_COLOR);
    };

    // revert the progress bar color on unhover
    const progressBarUnhover = () => {
        setProgressBarColor(WHITE_COLOR);
    };

    // when the user grabs the progress bar
    // we must freeze its change for the listened part of the track
    const stopUdateProgressBar = () => {
        setNeedUpdateProgressBar(false);
    };

    // apply a new value when releasing the progress bar
    // and resume change for the listened part of the track
    const startUdateProgressBar = (e: any) => {
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = e.target.value / 100;
        }
        setNeedUpdateProgressBar(true);
    };

    // change the repeat playback parameter
    const onCycle = () => {
        if (audioPlayer.current) {
            audioPlayer.current.loop = !audioPlayer.current.loop;
            setCycleState(audioPlayer.current.loop);
        }
    };

    // change the volume state when clicking the button
    const toggleMute = () => {
        dispatch(volumeManagerActions.setMute());
    };

    // change the volume state when dragging the volume bar
    const changeVolume = (e: any) => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = e.target.value / 100;
            dispatch(volumeManagerActions.setVolume(e.target.value / 100));
        }
    };

    // color the volume bar on hover
    const volumeBarHover = () => {
        setVolumeBarColor(PRIMARY_COLOR);
    };

    // revert the volume bar color on unhover
    const volumeBarUnhover = () => {
        setVolumeBarColor(WHITE_COLOR);
    };

    // get a new track when clicking the next or prev button
    const getPrevNextTrack = (isNext: boolean) => {
        const plus = (isNext ? 1 : -1);

        if (!currentTrack) {
            return;
        }
        if (!currentList) {
            return;
        }
        let currentId = -1;
        for (let i = 0; i < currentList.length; i++) {
            if (!currentList[i]) {
                continue;
            }
            if (currentTrack.id == currentList[i].id) {
                currentId = i;
                break;
            }
        }
        if (currentId == -1) {
            return;
        }
        currentId += plus;
        if (currentId >= currentList.length || currentId < 0) {
            currentId = 0;
        }
        return currentList[currentId];
    };

    // turn on the next track
    const goNext = () => {
        const newTrack = getPrevNextTrack(true);
        if (!newTrack) {
            return;
        }

        dispatch(PlayerActions.setTrack(newTrack));
    };

    // turn on the prev tracks
    const goPrev = () => {
        if (currentPosition > 200) {
            if (audioPlayer.current) {
                audioPlayer.current.currentTime = 0;
            }
            setCurrentPosition(0);
        }
        else {
            const newTrack = getPrevNextTrack(false);
            if (!newTrack) {
                return;
            }

            dispatch(PlayerActions.setTrack(newTrack));
        }
    };

    // try to get the track
    const getTrackObject = (e: any) => {
        let res = e.target;
        while (!res.id && res.parentElement && !(res.id == "unClicked")) {
            res = res.parentElement;
        }
        return res?.id as string;
    };

    // handle click on the window, if it's a track, then it needs focus
    document.querySelector("html")?.addEventListener("click", (e: any) => {
        dispatch(currentFocusActions.setFocus(getTrackObject(e)));
    });

    // calculate values for progress bar and volume bar
    const progressBarToProcent = currentPosition / (currentTrack?.durationMs ? currentTrack.durationMs / 1000 : currentPosition);
    const volumeBarToProcent = volumeManager.volume * 100;

    return <>
        <audio src={currentTrack?.previewUrl} ref={audioPlayer} onTimeUpdate={updateProgressBar}
            onEnded={goNext}></audio>
        <Outlet></Outlet>
        <footer className={styles["player"]}>
            <div className={styles["top-part"]}>
                <div className={styles["left-part"]}>
                    <img className={styles["track-info-img"]} src={currentTrack?.img ?? "/trackWithouImgIcon.svg"} alt="track img" />
                    <div className={styles["track-info-text"]}>
                        <div className={styles["track-name"]}>{currentTrack?.name}</div>
                        <div className={styles["track-author"]}>{currentTrack?.artists}</div>
                    </div>
                    <div className={styles["track-tags"]}></div>
                </div>
                <div className={styles["center-part"]}>
                    <div className={styles["center-buttons"]}>
                        <button onClick={goPrev} className={cn(styles["prev"], styles["center-button"])}>
                            <img src="/nextPrevIcon.svg" alt="" />
                        </button>
                        <button onClick={playTrack} className={cn(styles["play-pause"], styles["center-button"])}>
                            {!activeManager.active && <img src="/footerPlayIcon.svg" alt="" />}
                            {activeManager.active && <img src="/pauseIcon.svg" alt="" />}
                        </button>
                        <button onClick={goNext} className={cn(styles["next"], styles["center-button"])}>
                            <img src="/nextPrevIcon.svg" alt="" />
                        </button>
                        <button onClick={onCycle} className={cn(styles["cycle"], styles["center-button"], {
                            [styles["active-cycle"]]: cycleState
                        })}>
                            <img src="/loop.svg" alt="" />
                        </button>
                    </div>
                    <div className={styles["timeline"]}>
                        <div className={styles["current-position"]}>{currentPosition ? durationToText(currentPosition * 10) : "--:--"}</div>
                        <input type="range" min={0} max={currentTrack?.durationMs ? currentTrack.durationMs / 1000 * 100 : 0} className={styles["border-line"]}
                            value={currentPosition} onChange={changeProgressBar}
                            onMouseOver={progressBarHover} onMouseOut={progressBarUnhover}
                            onMouseDown={stopUdateProgressBar} onMouseUp={startUdateProgressBar}
                            style={{ background: `linear-gradient(to right, #${progressBarColor} ${progressBarToProcent}%, #301322 ${progressBarToProcent}%)` }} />
                        <div className={styles["track-len"]}>{currentTrack?.durationMs ? durationToText(currentTrack.durationMs) : "--:--"}</div>
                    </div>
                </div>
                <div className={styles["right-part"]}>
                    <div className={styles["volume-block"]}
                        onMouseOver={volumeBarHover} onMouseOut={volumeBarUnhover}>
                        <button onClick={toggleMute} className={cn(styles["volume-button"], {
                            [styles["audio-lvl0"]]: volumeManager.volume == 0,
                            [styles["audio-lvl1"]]: 0 < volumeManager.volume && volumeManager.volume < 0.33,
                            [styles["audio-lvl2"]]: 0.33 <= volumeManager.volume && volumeManager.volume < 0.66,
                            [styles["audio-lvl3"]]: 0.66 <= volumeManager.volume && volumeManager.volume
                        })}>
                            <img src="" alt="" />
                        </button>
                        <input type="range" className={styles["volume-line"]}
                            min={0} max={100} value={volumeManager.volume * 100} onChange={changeVolume}
                            style={{ background: `linear-gradient(to right, #${volumeBarColor} ${volumeBarToProcent}%, #301322 ${volumeBarToProcent}%)` }} />
                    </div>
                </div>
            </div>
            <Taglist
                track={trackWithTags ?? undefined}
                className={styles["player-tag-list"]}
                maxWidth={180}></Taglist>
        </footer>

        <Popup defaultOpen open={false} children={undefined}></Popup>
    </>;
}

export default Player;