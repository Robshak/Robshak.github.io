import { useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { RootState } from "../../Store/store";
import TrackItem from "../Track/Track";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";

function TrackList() {
    const { tracks } = useSelector((s: RootState) => s.searchlist);
    const [localTracks, setLocalTrack] = useState((tracks ?? []));

    useEffect(() => {
        if (tracks) {
            setLocalTrack(tracks);
        }
    }, [tracks]);

    if (!tracks) {
        return <></>;
    }

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
        className="track-list-wrapper">
        <Reorder.Group axis="y" onReorder={setLocalTrack} values={localTracks}
            className={styles["track-list"]}>
            {localTracks?.map((track, index) => {
                if (track) {
                    return <TrackItem key={track.id} track={track} index={index}
                        playlist={tracks}></TrackItem>;
                }
                else {
                    return <></>;
                }
            })}
        </Reorder.Group>
    </motion.div>;
}

export default TrackList;