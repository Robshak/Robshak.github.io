import { useState } from "react";
import styles from "./CreateTag.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import TagSettingPopup from "../../Popup/TagSettingPopup/TagSettingPopup";
import { CreateTagProps } from "./CreateTag.props";

// Object - footer for the popup with tag addition + popup control for tag creation
function CreateTag({ track, closePopup }: CreateTagProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { tags } = useSelector((s: RootState) => s.openTagsNow);
    const [openState, setOpenState] = useState(false);

    // Set a new list of tags for the track
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
