import { useDispatch, useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { AppDispatch, RootState } from "../../../Store/store";
import TrackItem from "../Track/Track";
import { Reorder, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CMPDynamicTags, PlayerActions } from "../../../Store/CurrentTrackStateSlices/playerManager.slice";
import { TrackListProps } from "./TrackList.props";

function TrackList({ tags, head }: TrackListProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { lists } = useSelector((s: RootState) => s.player);
    const [localTracks, setLocalTrack] = useState((lists.find(l => CMPDynamicTags(l.tags, tags))?.tracks ?? []));
    const focusTrack = useSelector((s: RootState) => s.currentFocus);

    useEffect(() => {
        if (lists) {
            setLocalTrack(lists.find(l => CMPDynamicTags(l.tags, tags))?.tracks ?? []);
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
        className={styles["track-list-wrapper"]}>
        {head}
        <Reorder.Group axis="y" onReorder={setLocalTrack} values={localTracks}
            className={styles["track-list"]}>
            {localTracks?.map((track, index) => {
                if (track) {
                    return <TrackItem key={track.id} track={track} index={index}
                        tags={tags} focusActive={focusTrack.currentFocus == track.id}></TrackItem>;
                }
            })}
        </Reorder.Group>
    </motion.div>;
}

export default TrackList;