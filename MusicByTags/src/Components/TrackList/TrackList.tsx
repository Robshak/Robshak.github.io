import { useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { RootState } from "../../Store/store";
import TrackItem from "../Track/Track";

function TrackList() {
    const { tracks } = useSelector((s: RootState) => s.searchlist);

    return <div className={styles["track-list"]}>
        {tracks?.map(i => {
            if (i) {
                return <TrackItem key={i.id} props={i}></TrackItem>;
            }
        })}
    </div>;
}

export default TrackList;