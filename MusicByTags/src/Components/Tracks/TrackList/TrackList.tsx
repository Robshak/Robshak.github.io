import { useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { RootState } from "../../../Store/store";
import { Reorder, motion } from "framer-motion";
import { TrackListProps } from "./TrackList.props";
import TrackItem from "../Track/Track";

function TrackList({ head, list, changerList }: TrackListProps) {
    const focusTrack = useSelector((s: RootState) => s.currentFocus);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePan = (e: any) => {
        const mousePos = e.clientY;
        const windowHeight = window.screen.height;
        if (mousePos < 100) {
            scrollTo(0, window.pageYOffset - 15);
        } else if (windowHeight - mousePos < 300) {
            scrollTo(0, window.pageYOffset + 15);
        }
    };

    return <motion.div
        onPan={handlePan}
        className={styles["track-list-wrapper"]}>
        {head}
        <Reorder.Group axis="y" onReorder={changerList} values={list}
            className={styles["track-list"]}>
            {list?.map((track, index) => {
                if (track) {
                    return <TrackItem key={track.id} track={track} index={index}
                        list={list}
                        focusActive={focusTrack.currentFocus == track.id}></TrackItem>;
                }
            })}
        </Reorder.Group>
    </motion.div>;
}

export default TrackList;