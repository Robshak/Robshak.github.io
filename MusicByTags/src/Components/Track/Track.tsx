import { useDispatch, useSelector } from "react-redux";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { activeManagerActions } from "../../Store/activeManager.slice";
import cn from "classnames";
import { Reorder } from "framer-motion";
import { TrackItemProps } from "./Track.props";
import { PlayerActions } from "../../Store/playerManager.slice";
import AddTag from "../AddTag/AddTag";

function TrackItem({ track, tags, className, index }: TrackItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.player.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);

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

    // const trackMove = () => {
    //     dispatch(PlayerActions.pushList())
    // }

    const setAnimation = currentTrack?.previewUrl == track.previewUrl && activeManager.active;

    return <Reorder.Item
        value={track} id={track.id}
        onDoubleClick={playTrack} className={cn(styles["track"], className, {
            [styles["active-track"]]: currentTrack?.previewUrl == track.previewUrl
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
        {currentTrack ? <AddTag tags={tags} trackId={currentTrack?.id}></AddTag> : <></>}
        <div className={styles["time"]}>
            {track.durationText}
        </div>
    </Reorder.Item>;
}

export default TrackItem;