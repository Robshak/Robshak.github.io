import styles from "./DynamicTagPopup.module.css";
import Popup from "reactjs-popup";
import { DynamicTagPopupProps } from "./DynamicTagPopup.props";
import { getTagList } from "../../../workWithTags/getTagList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { useEffect, useState } from "react";
import { CurrentDynamicTagsStateActions } from "../../../Store/TagsSlices/currentDynamicTags";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";

function DynamicTagPopup({ dynamicTagId, favoriteTags, onClose }: DynamicTagPopupProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [openState, setOpenState] = useState(true);
    const { tags } = useSelector((s: RootState) => s.tagList);
    const openTags = useSelector((s: RootState) => s.openTagsNow);

    useEffect(() => {
        dispatch(openTagsNowStateActions.setTags(favoriteTags));
    }, [dispatch, favoriteTags]);

    const localOnClose = () => {
        dispatch(openTagsNowStateActions.clearState());
        setOpenState(false);
        onClose();
    };

    const submit = () => {
        if (!dynamicTagId) {
            dispatch(CurrentDynamicTagsStateActions.addDynamicTag(openTags.tags));
        }
        else {
            console.log(openTags);
            dispatch(CurrentDynamicTagsStateActions.setDynamicTag({
                id: dynamicTagId,
                tags: openTags.tags
            }));
        }
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