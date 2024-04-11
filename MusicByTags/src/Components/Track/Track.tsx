import { useDispatch, useSelector } from "react-redux";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { activeManagerActions } from "../../Store/activeManager.slice";
import cn from "classnames";
import { Reorder } from "framer-motion";
import { TrackItemProps } from "./Track.props";
import { PlayerActions } from "../../Store/playerManager.slice";
import AddTag from "../AddTag/AddTag";
import Popup from "reactjs-popup";

function TrackItem({ track, tags, className, index, focusActive }: TrackItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    if (!track.tags) {
        track = tracks.find(tr => tr.id == track.id) ?? { ...track, tags: [] };
    }

    const playTrack = () => {
        if (currentTrack?.previewUrl != track.previewUrl) {
            dispatch(PlayerActions.setTrack({
                track,
                tags
            }));
            dispatch(activeManagerActions.setActive(true));
        }
        else {
            dispatch(activeManagerActions.toggleActive());
        }
    };

    const clickToTrack = () => {
        if (focusActive) {
            playTrack();
        }
    };

    const setAnimation = currentTrack?.previewUrl == track.previewUrl && activeManager.active;

    return <Reorder.Item
        value={track} id={track.id} onClick={clickToTrack}
        className={cn(styles["track"], className, {
            [styles["active-track"]]: currentTrack?.previewUrl == track.previewUrl,
            [styles["focus-track"]]: focusActive
        })}>
        <div className={styles["start-block"]} onClick={playTrack}>
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
        <Popup
            trigger={<div className={styles["count-tags"]}>{track.tags?.length ?? 0}</div>}
            on={["hover"]}
            position={"top center"}
        >
            <div className={styles["count-tags-popup"]}>Count of tags on this track</div>
        </Popup>
        {track ? <AddTag track={track}></AddTag> : <></>}
        <div className={styles["time"]}>
            {track.durationText}
        </div>
    </Reorder.Item>;
}

export default TrackItem;