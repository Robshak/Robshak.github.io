import { useDispatch, useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { AppDispatch, RootState } from "../../Store/store";
import TrackItem from "../Track/Track";
import Reorder from "react-reorder";
import { useEffect, useState } from "react";
import { Tag } from "../../interfaces/tag.interface";
import { CMP, PlayerActions } from "../../Store/playerManager.slice";

function TrackList({ tags }: { tags: Tag[] }) {
    const dispatch = useDispatch<AppDispatch>();
    const { lists } = useSelector((s: RootState) => s.player);
    const [localTracks, setLocalTrack] = useState((lists.find(l => CMP(l.tags, tags))?.tracks ?? []));
    const focusTrack = useSelector((s: RootState) => s.currentFocus);

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

    return <div className={styles["track-list-wrapper"]}>
        <Reorder
            reorderId="playlist" // Unique ID that is used internally to track this list (required)
            reorderGroup="playlist-group" // A group ID that allows items to be dragged between lists of the same group (optional)
            component="ul" // Tag name or Component to be used for the wrapping element (optional), defaults to 'div'
            draggedClassName="dragged" // Class name to be applied to dragged elements (optional), defaults to 'dragged'
            lock="horizontal" // Lock the dragging direction (optional): vertical, horizontal (do not use with groups)
            //holdTime={500} // Default hold time before dragging begins (mouse & touch) (optional), defaults to 0
            touchHoldTime={200} // Hold time before dragging begins on touch devices (optional), defaults to holdTime
            mouseHoldTime={0} // Hold time before dragging begins with mouse (optional), defaults to holdTime
            onReorder={setLocalTrack} // Callback when an item is dropped (you will need this to update your state)
            autoScroll={true} // Enable auto-scrolling when the pointer is close to the edge of the Reorder component (optional), defaults to true
            className={styles["track-list"]}
        >
            {localTracks?.map((track, index) => {
                if (track) {
                    return <TrackItem key={track.id} track={track} index={index}
                        tags={tags} focusActive={focusTrack.currentFocus == track.id}></TrackItem>;
                }
            })}
        </Reorder>
    </div>;
}

export default TrackList;