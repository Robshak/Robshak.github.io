import styles from "./DynamicTagPopup.module.css";
import Popup from "reactjs-popup";
import { DynamicTagPopupProps } from "./DynamicTagPopup.props";
import { getTagList } from "../../../workWithTags/getTagList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { useEffect, useState } from "react";
import { CurrentDynamicTagsStateActions } from "../../../Store/TagsSlices/currentDynamicTags";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";

// Popup for controlling a multitag - a tag that can include multiple tags within itself
function DynamicTagPopup({ dynamicTagId, favoriteTags, onClose }: DynamicTagPopupProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [openState, setOpenState] = useState(true);
    const { tags } = useSelector((s: RootState) => s.tagList);
    const openTags = useSelector((s: RootState) => s.openTagsNow);

    // Setting selected tags
    useEffect(() => {
        dispatch(openTagsNowStateActions.setTags(favoriteTags));
    }, [dispatch, favoriteTags]);

    // Close popup
    const localOnClose = () => {
        dispatch(openTagsNowStateActions.clearState());
        setOpenState(false);
        onClose();
    };

    // Applying changes
    const submit = () => {
        if (!dynamicTagId) { // If tag is not exist - create it
            dispatch(CurrentDynamicTagsStateActions.addDynamicTag(openTags.tags));
        }
        else { // Else change it
            dispatch(CurrentDynamicTagsStateActions.setDynamicTag({
                id: dynamicTagId,
                tags: openTags.tags
            }));
        }
        // And close popup
        dispatch(openTagsNowStateActions.clearState());
        setOpenState(false);
    };

    return <Popup open={openState}
        onClose={() => {
            localOnClose();
        }}
        nested
        modal
    >
        <div className={styles["wrapper"]}>
            <button onClick={() => {
                localOnClose();
            }} className={styles["cross"]}>
                <img src="/popupCrossIcon.svg" alt="" />
            </button>
            <div className={styles["header"]}>{!dynamicTagId ? "Add template" : "Modify template"}</div>
            <div className={styles["tag-list"]}>
                {getTagList(tags, favoriteTags)}
            </div>
            <button onClick={submit} className={styles["create-taglist"]}>
                {!dynamicTagId ? "Add" : "Modify"}
            </button>
        </div>
    </Popup>;
}

export default DynamicTagPopup;