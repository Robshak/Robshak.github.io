import { Track } from "../../interfaces/Track.interface";
import styles from "./Track.module.css";

function TrackItem({ params, number }: { params: Track, number: number }) {
    return <div className={styles["track"]}>
        <div className={styles["start-block"]}>
            {number}
        </div>
        <div className={styles["img-box"]}>
            <img src={params.img} alt="" />
        </div>
    </div>;
}

export default TrackItem;