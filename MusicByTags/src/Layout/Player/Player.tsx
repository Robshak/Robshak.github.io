import { useDispatch, useSelector } from "react-redux";
import styles from "./Player.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { durationToText } from "../../workWithAPI/getTracks";
import { Outlet } from "react-router-dom";
import { volumeManagerActions } from "../../Store/volumeManage.slice";
import { activeManagerActions } from "../../Store/activeManager.slice";
import { CMP, PlayerActions } from "../../Store/playerManager.slice";
import { currentFocusActions } from "../../Store/currentMouseFocus.slice";

const PRIMARY_COLOR = "F178B6";
const WHITE_COLOR = "fff";

function Player() {
    const dispatch = useDispatch<AppDispatch>();
    const [progressBarColor, setProgressBarColor] = useState<string>(WHITE_COLOR);
    const [volumeBarColor, setVolumeBarColor] = useState<string>(WHITE_COLOR);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [needUpdateProgressBar, setNeedUpdateProgressBar] = useState<boolean>(true);
    const [cycleState, setCycleState] = useState<boolean>(false);
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const currentTags = useSelector((s: RootState) => s.player.currentTags);
    const { lists } = useSelector((s: RootState) => s.player);
    const volumeManager = useSelector((s: RootState) => s.volumeManager);
    const activeManager = useSelector((s: RootState) => s.activeManager);

    const audioPlayer = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        if (currentTrack && audioPlayer.current) {
            audioPlayer.current.src = currentTrack.previewUrl;
        }
    }, [currentTrack, audioPlayer]);

    useEffect(() => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = volumeManager.volume;
        }
    }, [volumeManager.volume, audioPlayer]);

    useEffect(() => {
        if (audioPlayer.current && activeManager.active) {
            audioPlayer.current.play();
        }
        else if (audioPlayer.current) {
            audioPlayer.current.pause();
        }
    });

    const playTrack = () => {
        dispatch(activeManagerActions.toggleActive());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeProgressBar = (e: any) => {
        if (audioPlayer.current) {
            if (needUpdateProgressBar) {
                audioPlayer.current.currentTime = e.target.value / 100;
            }
            setCurrentPosition(e.target.value);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProgressBar = (e: any) => {
        if (needUpdateProgressBar) {
            setCurrentPosition(e.target.currentTime * 100);
        }
    };

    const progressBarHover = () => {
        setProgressBarColor(PRIMARY_COLOR);
    };

    const progressBarUnhover = () => {
        setProgressBarColor(WHITE_COLOR);
    };

    const stopUdateProgressBar = () => {
        setNeedUpdateProgressBar(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startUdateProgressBar = (e: any) => {
        if (audioPlayer.current) {
            audioPlayer.current.currentTime = e.target.value / 100;
        }
        setNeedUpdateProgressBar(true);
    };

    const onCycle = () => {
        if (audioPlayer.current) {
            audioPlayer.current.loop = !audioPlayer.current.loop;
            setCycleState(audioPlayer.current.loop);
        }
    };

    const toggleMute = () => {
        dispatch(volumeManagerActions.setMute());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeVolume = (e: any) => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = e.target.value / 100;
            dispatch(volumeManagerActions.setVolume(e.target.value / 100));
        }
    };

    const volumeBarHover = () => {
        setVolumeBarColor(PRIMARY_COLOR);
    };

    const volumeBarUnhover = () => {
        setVolumeBarColor(WHITE_COLOR);
    };

    const getPrevNextTrack = (isNext: boolean) => {
        const plus = (isNext ? 1 : -1);

        if (!currentTrack) {
            return;
        }
        const currentList = lists.find(l => CMP(l.tags, currentTags));
        if (!currentList) {
            return;
        }
        let currentId = -1;
        for (let i = 0; i < currentList.tracks.length; i++) {
            if (!currentList.tracks[i]) {
                continue;
            }
            if (currentTrack.id == currentList.tracks[i].id) {
                currentId = i;
                break;
            }
        }
        if (currentId == -1) {
            return;
        }
        currentId += plus;
        if (currentId >= currentList.tracks.length || currentId < 0) {
            currentId = 0;
        }
        return currentList.tracks[currentId];
    };

    const goNext = () => {
        const newTrack = getPrevNextTrack(true);
        if (!newTrack) {
            return;
        }

        dispatch(PlayerActions.setTrack({
            track: newTrack,
            tags: currentTags
        }));
    };

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

            dispatch(PlayerActions.setTrack({
                track: newTrack,
                tags: currentTags
            }));
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getTrackObject = (e: any) => {
        let res = e.target;
        while (!res.id && res.parentElement && !(res.value == "unClicked")) {
            res = res.parentElement;
        }
        return res?.id as string;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document.querySelector("html")?.addEventListener("click", (e: any) => {
        dispatch(currentFocusActions.setFocus(getTrackObject(e)));
    });

    const progressBarToProcent = currentPosition / (currentTrack?.durationMs ? currentTrack.durationMs / 1000 : currentPosition);
    const volumeBarToProcent = volumeManager.volume * 100;

    return <>
        <audio src={currentTrack?.previewUrl} ref={audioPlayer} onTimeUpdate={updateProgressBar}
            onEnded={goNext}></audio>
        <Outlet></Outlet>
        <footer className={styles["player"]}>
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
                <button className={styles["open-track"]}>
                    <img src="/openTrackInfoIcon.svg" alt="open track info" />
                </button>
            </div>
        </footer>
    </>;
}

export default Player;