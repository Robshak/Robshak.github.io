import { useDispatch, useSelector } from "react-redux";
import { Track } from "../../interfaces/Track.interface";
import styles from "./Track.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import { currentTrackActions } from "../../Store/currentTrack.slice";
import { activeManagerActions } from "../../Store/activeManager.slice";
import cn from "classnames";

function TrackItem({ props, playlist }: { props: Track, playlist: (Track | undefined)[] | null }) {
    const dispatch = useDispatch<AppDispatch>();
    const currentTrack = useSelector((s: RootState) => s.currentTrack);
    const activeManager = useSelector((s: RootState) => s.activeManager);

    const playTrack = () => {
        if (currentTrack.track?.url != props.previewUrl) {
            dispatch(currentTrackActions.setTrack({
                track: props,
                playlist
            }));
            dispatch(activeManagerActions.setActive(true));
        }
        else {
            dispatch(activeManagerActions.toggleActive());
        }
    };

    const setAnimation = currentTrack.track?.url == props.previewUrl && activeManager.active;

    return <button onClick={playTrack} className={cn(styles["track"], {
        [styles["active-track"]]: currentTrack.track?.url == props.previewUrl
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
                <div className={styles["id"]}>{props.number + 1}</div>
            </>}
        </div>
        <img className={styles["img"]} src={props.img} alt="" />
        <div className={styles["name-author"]}>
            <div className={styles["name"]}>{props.name}</div>
            <div className={styles["author"]}>{props.artists}</div>
        </div>
        <div className={styles["album"]}>
            {props.album}
        </div>
        <div className={styles["tags"]}>

        </div>
        <div className={styles["time"]}>
            {props.durationText}
        </div>
    </button>;
}

export default TrackItem;