import { useDispatch } from "react-redux";
import { Track } from "../../interfaces/Track.interface";
import styles from "./Track.module.css";
import { AppDispatch } from "../../Store/store";
import { currentTrackActions } from "../../Store/currentTrack.slice";

function TrackItem({ props }: { props: Track }) {
    const dispatch = useDispatch<AppDispatch>();

    const playTrack = () => {
        dispatch(currentTrackActions.setTrack(props));
    };

    return <button onClick={playTrack} className={styles["track"]}>
        <div className={styles["start-block"]}>
            <img className={styles["play-icon"]} src="/playIcon.svg" alt="" />
            <div className={styles["id"]}>{props.number}</div>
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
        {/* {props.previewUrl && <audio controls src={props.previewUrl}></audio>} */}
    </button>;
}

export default TrackItem;