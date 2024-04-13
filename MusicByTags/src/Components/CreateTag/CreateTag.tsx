import { useState } from "react";
import styles from "./CreateTag.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { Track } from "../../interfaces/Track.interface";
import { taglistOnTrackStateActions } from "../../Store/tagListOnTrack..slice";
import TagSettingPopup from "../Popup/TagSettingPopup/TagSettingPopup";

export type CreateTagForm = {
    tagName: {
        value: string
    },
    color: {
        value: string
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CreateTag({ track, closePopup }: { track: Track, closePopup: any }) {
    const dispatch = useDispatch<AppDispatch>();
    const { tags } = useSelector((s: RootState) => s.openTagsNow);
    const [openState, setOpenState] = useState(false);

    const setTags = () => {
        dispatch(taglistOnTrackStateActions.setOnTrack({ track: track, tags: tags }));
        closePopup();
    };

    return <>
        <div className={styles["buttons-block"]}>
            <button onClick={() => { setOpenState(true); }} className={styles["create-tag"]}>Create tag</button>
            <button onClick={setTags} className={styles["ready"]}>Ready</button>
        </div>
        {openState && <TagSettingPopup onClose={() => setOpenState(false)}
        >
        </TagSettingPopup>}
    </>;
}

export default CreateTag;