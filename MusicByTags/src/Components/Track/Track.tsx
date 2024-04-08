import { useDispatch, useSelector } from "react-redux";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { currentTrackActions } from "../../Store/currentTrack.slice";
import { activeManagerActions } from "../../Store/activeManager.slice";
import cn from "classnames";
import { Reorder } from "framer-motion";
import { TrackItemProps } from "./Track.props";
import { ListsActions } from "../../Store/Lists.slice";

function TrackItem({ track, tags, className, index }: TrackItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);

    const playTrack = () => {
        if (currentTrack.track?.url != track.previewUrl) {
            dispatch(currentTrackActions.setTrack({
                track: track,
                listTags: tags
            }));
            dispatch(activeManagerActions.setActive(true));
        }
        else {
            dispatch(activeManagerActions.toggleActive());
        }
    };

    const reworkList = () => {
        // console.log(track.number, index);
        dispatch(ListsActions.moveTrack({ oldId: track.number, newId: index, tags }));
    };

    const setAnimation = currentTrack.track?.url == track.previewUrl && activeManager.active;

    return <Reorder.Item
        value={track} id={track.id} onDragEnd={reworkList}
        onDoubleClick={playTrack} className={cn(styles["track"], className, {
            [styles["active-track"]]: currentTrack.track?.url == track.previewUrl
        })}>
        <div className={styles["start-block"]}>
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
        <div className={styles["tags"]}>

        </div>
        <div className={styles["time"]}>
            {track.durationText}
        </div>
    </Reorder.Item>;
}

export default TrackItem;