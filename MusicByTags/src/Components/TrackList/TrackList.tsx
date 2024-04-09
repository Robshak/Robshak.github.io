import { useDispatch, useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import TrackItem from "../Track/Track";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Tag } from "../../interfaces/tag.interface";
import { CMP, PlayerActions } from "../../Store/playerManager.slice";

function TrackList({ tags }: { tags: Tag[] }) {
    const dispatch = useDispatch<AppDispatch>();
    const { lists } = useSelector((s: RootState) => s.player);
    const [localTracks, setLocalTrack] = useState((lists.find(l => CMP(l.tags, tags))?.tracks ?? []));

    useEffect(() => {
        if (lists) {
            setLocalTrack(lists.find(l => CMP(l.tags, tags))?.tracks ?? []);
        }
    }, [lists, tags]);

    useEffect(() => {
        dispatch(PlayerActions.pushList({
            tracks: localTracks,
            tags
        }));
    }, [dispatch, localTracks, tags]);

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
                        tags={tags}></TrackItem>;
                }
            })}
        </Reorder.Group>
    </motion.div>;
}

export default TrackList;