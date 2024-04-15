import { useDispatch, useSelector } from "react-redux";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../../Store/store";
import { activeManagerActions } from "../../../Store/CurrentTrackStateSlices/activeManager.slice";
import cn from "classnames";
import { Reorder } from "framer-motion";
import { TrackItemProps } from "./Track.props";
import { PlayerActions } from "../../../Store/CurrentTrackStateSlices/playerManager.slice";
import AddTag from "../../Tags/AddTag/AddTag";
import TagBlock from "../../Tags/TagBlock/TagBlock";
import { MouseEvent } from "react";

// Object - track in the track list
function TrackItem({ track, list, className, index, focusActive }: TrackItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    // Save the old track for correct drag-and-drop functionality
    // and add tags from the new track instance
    const baseTrack = track;
    const trackWithTags = tracks.find(tr => tr.id == track.id);
    if (trackWithTags) {
        track = trackWithTags;
    }

    // Play / pause track
    const playTrack = () => {
        if (currentTrack?.previewUrl != track.previewUrl) {
            dispatch(PlayerActions.setTrack(track));
            dispatch(PlayerActions.setCurrentList(list));
            dispatch(activeManagerActions.setActive(true));
        }
        else {
            dispatch(activeManagerActions.toggleActive());
        }
    };

    // Handle track click
    const clickToTrack = () => {
        if (focusActive) {
            playTrack();
        }
    };

    // Handle button click, no need to check for focus
    const clickToButton = (e: MouseEvent) => {
        playTrack();
        e.stopPropagation();
    };

    // Enable animation if the track is playing and selected
    const setAnimation = currentTrack?.previewUrl == track.previewUrl && activeManager.active;

    return <Reorder.Item
        value={baseTrack} id={track.id} onClick={clickToTrack}
        className={cn(styles["track"], className, {
            [styles["active-track"]]: currentTrack?.previewUrl == track.previewUrl,
            [styles["focus-track"]]: focusActive
        })}>
        <div className={styles["track-block"]}>
            <div className={styles["start-block"]} onClick={clickToButton}>
                {setAnimation && <div className={styles["animation"]}>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                    <div className={styles["stroke"]}></div>
                </div>}
                {!setAnimation && <>
                    <img className={styles["play-icon"]} src="/playIcon.svg" alt="" />
                    <div className={styles["id"]}>{index + 1}</div>
                </>}
            </div>
            <img className={styles["img"]} src={track.img} alt="" />
            <div className={styles["name-author"]}>
                <div className={styles["name"]}>{track.name}</div>
                <div className={styles["author"]}>{track.artists}</div>
            </div>
            <div className={styles["album"]}>
                {track.album}
            </div>
            <div className={styles["time"]}>
                {track.durationText}
            </div>
        </div>
        <div className={styles["tags-block"]}>
            <div className={styles["favorites-tags"]}>
                {track.tags.map((tg, index) => {
                    return <TagBlock
                        key={index}
                        mini
                        tag={tg}
                        className={styles["mini-tag"]}
                        track={track}
                    ></TagBlock>;
                })}
            </div>
            {track ? <AddTag track={track}></AddTag> : <></>}
        </div>
    </Reorder.Item>;
}

export default TrackItem;
