import { useDispatch, useSelector } from "react-redux";
// import { Track } from "../../interfaces/Track.interface";
import styles from "./Player.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { currentTrackActions } from "../../Store/currentTrack.slice";
import { useEffect, useState } from "react";
import cn from "classnames";
import { durationToText } from "../../workWithAPI/getTracks";
import { Outlet } from "react-router-dom";

function Player() {
    const dispatch = useDispatch<AppDispatch>();
    const [currentPosition, setCurrentPosition] = useState<number>();
    const [player] = useState(new Audio());
    const currentTrack = useSelector((s: RootState) => s.currentTrack);

    useEffect(() => {
        if (currentTrack.track) {
            player.src = currentTrack.track.url;
            player.volume = currentTrack.volume;

            if (currentTrack.active) {
                player.play();
            }
            else {
                player.pause();
            }

            player.currentTime = currentTrack.currentPosition;
            player.loop = currentTrack.cycle;
        }
    }, [currentTrack, player]);

    useEffect(() => {
        loop();
    }, []);

    const playTrack = () => {
        dispatch(currentTrackActions.setPosition(player.currentTime));
        dispatch(currentTrackActions.playPauseTrack());
    };

    const loop = () => {
        window.requestAnimationFrame(loop);
        setCurrentPosition(player.currentTime);
    };

    const clickToTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
        const elementX = e.nativeEvent.offsetX;
        const mouseX = e.clientX;
        const len = document.getElementById("border-line")?.offsetWidth;
        if (currentTrack.len_ms && len) {
            const newValue = (mouseX - (mouseX - elementX)) / len * 100;
            // console.log(currentTrack.len_ms / 100000 * newValue);
            player.currentTime = currentTrack.len_ms / 100000 * newValue;
        }
    };

    function dragElement(point: HTMLElement | null) {
        if (!point) {
            return;
        }
        let mousePos = 0;
        point.onmousedown = dragMouseDown;
        const len = document.getElementById("border-line")?.offsetWidth;
        const distLeft = document.getElementById("border-line")?.offsetLeft;
        let minima = 0;
        let maxima = 0;
        if (distLeft) {
            minima = distLeft;
        }
        if (len) {
            maxima = minima + len;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function dragMouseDown(e: any) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            mousePos = e.clientX;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function elementDrag(e: any) {
            e = e || window.event;
            e.preventDefault();
            mousePos = e.clientX;
            if (point) {
                let newValue = mousePos;
                newValue = Math.min(newValue, maxima);
                newValue = Math.max(newValue, minima);
                point.style.left = String(newValue) + "px";

                newValue -= minima;

                if (len && currentTrack.len_ms) {
                    player.currentTime = newValue / len * currentTrack.len_ms / 1000;
                }
            }
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    dragElement(document.getElementById("point"));

    return <>
        <Outlet></Outlet>
        <footer className={styles["player"]}>
            <div className={styles["left-part"]}>
                <img className={styles["track-info-img"]} src={currentTrack.track?.img} alt="track img" />
                <div className={styles["track-info-text"]}>
                    <div className={styles["track-name"]}>{currentTrack.track?.name}</div>
                    <div className={styles["track-author"]}>{currentTrack.track?.artists}</div>
                </div>
                <div className={styles["track-tags"]}></div>
            </div>
            <div className={styles["center-part"]}>
                <div className={styles["center-buttons"]}>
                    <button className={cn(styles["prev"], styles["center-button"])}>
                        <img src="/nextPrevIcon.svg" alt="" />
                    </button>
                    <button onClick={playTrack} className={cn(styles["play-pause"], styles["center-button"])}>
                        {!currentTrack.active && <img src="/footerPlayIcon.svg" alt="" />}
                        {currentTrack.active && <img src="/pauseIcon.svg" alt="" />}
                    </button>
                    <button className={cn(styles["next"], styles["center-button"])}>
                        <img src="/nextPrevIcon.svg" alt="" />
                    </button>
                    <button className={cn(styles["cycle"], styles["center-button"])}>
                        <img src="/loop.svg" alt="" />
                    </button>
                </div>
                <div className={styles["timeline"]}>
                    <div className={styles["current-position"]}>{currentPosition ? durationToText(currentPosition * 1000) : "--:--"}</div>
                    <div onMouseDown={clickToTimeline} id="border-line" className={styles["border-line"]}>
                        <div className={styles["line"]} style={
                            { width: `${String(Math.ceil(currentPosition && currentTrack.len_ms ? 100000 * currentPosition / currentTrack.len_ms : 0))}%` }
                        }></div>
                        <div id="point" className={cn(styles["point"], {
                            [styles["kill-point"]]: !currentTrack.track
                        })} style={
                            { left: `${String(Math.ceil(currentPosition && currentTrack.len_ms ? 100000 * currentPosition / currentTrack.len_ms : 0))}%` }
                        }></div>
                    </div>
                    <div className={styles["track-len"]}>{currentTrack.len_ms ? durationToText(currentTrack.len_ms) : "--:--"}</div>
                </div>
            </div>
            <div className={styles["right-part"]}>
                <button className={styles["volume-button"]}></button>
                <div className={styles["volume-line"]}></div>
                <button className={styles["open-song"]}></button>
            </div>
        </footer>
    </>;
}

export default Player;