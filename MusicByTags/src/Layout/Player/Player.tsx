import { useDispatch, useSelector } from "react-redux";
import styles from "./Player.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { durationToText } from "../../workWithAPI/getTracks";
import { Outlet } from "react-router-dom";
import { volumeManagerActions } from "../../Store/volumeManage.slice";
import { activeManagerActions } from "../../Store/activeManager.slice";
import { currentTrackActions } from "../../Store/currentTrack.slice";

const PRIMARY_COLOR = "F178B6";
const WHITE_COLOR = "fff";

function Player() {
    const dispatch = useDispatch<AppDispatch>();
    const [progressBarColor, setProgressBarColor] = useState<string>(WHITE_COLOR);
    const [volumeBarColor, setVolumeBarColor] = useState<string>(WHITE_COLOR);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [needUpdateProgressBar, setNeedUpdateProgressBar] = useState<boolean>(true);
    const [cycleState, setCycleState] = useState<boolean>(false);
    const currentTrack = useSelector((s: RootState) => s.currentTrack);
    const volumeManager = useSelector((s: RootState) => s.volumeManager);
    const activeManager = useSelector((s: RootState) => s.activeManager);

    const player = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        if (currentTrack.track && player.current) {
            player.current.src = currentTrack.track.url;
        }
    }, [currentTrack, player]);

    useEffect(() => {
        if (player.current) {
            player.current.volume = volumeManager.volume;
        }
    }, [volumeManager.volume, player]);

    useEffect(() => {
        if (player.current && activeManager.active) {
            player.current.play();
        }
        else if (player.current) {
            player.current.pause();
        }
    });

    const playTrack = () => {
        dispatch(activeManagerActions.toggleActive());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeProgressBar = (e: any) => {
        if (player.current) {
            if (needUpdateProgressBar) {
                player.current.currentTime = e.target.value / 100;
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
        if (player.current) {
            player.current.currentTime = e.target.value / 100;
        }
        setNeedUpdateProgressBar(true);
    };

    const onCycle = () => {
        if (player.current) {
            player.current.loop = !player.current.loop;
            setCycleState(player.current.loop);
        }
    };

    const toggleMute = () => {
        dispatch(volumeManagerActions.setMute());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeVolume = (e: any) => {
        if (player.current) {
            player.current.volume = e.target.value / 100;
            dispatch(volumeManagerActions.setVolume(e.target.value / 100));
        }
    };

    const volumeBarHover = () => {
        setVolumeBarColor(PRIMARY_COLOR);
    };

    const volumeBarUnhover = () => {
        setVolumeBarColor(WHITE_COLOR);
    };

    const goNext = () => {
        if (!currentTrack.track) {
            return;
        }
        if (!currentTrack.track.next) {
            return;
        }
        dispatch(currentTrackActions.setTrack({
            track: currentTrack.track.next,
            listTags: currentTrack.tags
        }));
        // dispatch(activeManagerActions.setActive(false));
    };

    const goPrev = () => {
        if (currentPosition > 200) {
            if (player.current) {
                player.current.currentTime = 0;
            }
            setCurrentPosition(0);
        }
        else {
            if (!currentTrack.track) {
                return;
            }
            if (!currentTrack.track.prev) {
                return;
            }
            dispatch(currentTrackActions.setTrack({
                track: currentTrack.track.prev,
                listTags: currentTrack.tags
            }));
        }
    };

    const progressBarToProcent = currentPosition / (currentTrack.len_s ? currentTrack.len_s : currentPosition);
    const volumeBarToProcent = volumeManager.volume * 100;

    return <>
        <audio src={currentTrack.track?.url} ref={player} onTimeUpdate={updateProgressBar}
            onEnded={goNext}></audio>
        <Outlet></Outlet>
        <footer className={styles["player"]}>
            <div className={styles["left-part"]}>
                <img className={styles["track-info-img"]} src={currentTrack.track?.img ?? "/trackWithouImgIcon.svg"} alt="track img" />
                <div className={styles["track-info-text"]}>
                    <div className={styles["track-name"]}>{currentTrack.track?.name}</div>
                    <div className={styles["track-author"]}>{currentTrack.track?.artists}</div>
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
                    <input type="range" min={0} max={currentTrack.len_s ? currentTrack.len_s * 100 : 0} className={styles["border-line"]}
                        value={currentPosition} onChange={changeProgressBar}
                        onMouseOver={progressBarHover} onMouseOut={progressBarUnhover}
                        onMouseDown={stopUdateProgressBar} onMouseUp={startUdateProgressBar}
                        style={{ background: `linear-gradient(to right, #${progressBarColor} ${progressBarToProcent}%, #301322 ${progressBarToProcent}%)` }} />
                    <div className={styles["track-len"]}>{currentTrack.len_s ? durationToText(currentTrack.len_s * 1000) : "--:--"}</div>
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