import { useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { RootState } from "../../../Store/store";
import { Reorder, motion } from "framer-motion";
import { TrackListProps } from "./TrackList.props";
import TrackItem from "../Track/Track";
import { useRef } from "react";

// Object - playlist
function TrackList({ head, list, changerList }: TrackListProps) {
    const focusTrack = useSelector((s: RootState) => s.currentFocus);
    const listDisplay: any = useRef(null);

    // Clear list
    listDisplay.innerHTML = "";

    // Handling scroll during drag-and-drop dragging
    const handlePan = (e: any) => {
        const mousePos = e.clientY;
        const windowHeight = window.screen.height;
        if (mousePos < 200) {
            scrollTo(0, window.pageYOffset - 15);
        } else if (windowHeight - mousePos < 300) {
            scrollTo(0, window.pageYOffset + 15);
        }
    };

    return <div className={styles["track-list-wrapper"]}>
        {head}
        <header className={styles["header"]}>
            <div>№</div>
            <div></div>
            <div>Name</div>
            <div>Album</div>
            <div>Duration</div>
        </header>
        <motion.div
            onPan={handlePan}
        >
            <Reorder.Group axis="y" onReorder={changerList} values={list} ref={listDisplay}
                className={styles["track-list"]}>
                {list?.map((track, index) => {
                    if (track) {
                        return <TrackItem key={index} track={track} index={index}
                            list={list}
                            focusActive={focusTrack.currentFocus == track.id}></TrackItem>;
                    }
                })}
            </Reorder.Group>
        </motion.div>
    </div>;
}

export default TrackList;