import styles from "./AddTag.module.css";
import { AddTagProps } from "./AddTag.props";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import cn from "classnames";
import Popup from "reactjs-popup";
import CreateTag from "../CreateTag/CreateTag";
import { MouseEvent, useState } from "react";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";
import { ContextMenuPosition } from "../../Context/Contextmenu/Contextmenu.context";
import { getTagList } from "../../../workWithTags/getTagList";

function AddTag({ track }: AddTagProps) {
    const dispatch = useDispatch<AppDispatch>();
    const allTags = useSelector((s: RootState) => s.tagList);
    const [popupState, setPopupState] = useState(false);
    const [popupPosition, setPopupPosition] = useState<ContextMenuPosition>();

    const setTags = (e: MouseEvent) => {
        if (!track) {
            return;
        }
        let plus = 0;
        const windowHeight = window.innerHeight;
        if (windowHeight - e.clientY < 300) {
            plus = -300;
        }
        setPopupPosition({ x: e.clientX, y: e.clientY + plus });
        dispatch(openTagsNowStateActions.setTags(track.tags));
        setPopupState(s => !s);
    };

    return <>
        <button onClick={setTags} className={styles["tag-button-wrapper"]} value={"unClicked"}>
            <div className={styles["tag-button"]}>
                <div className={cn(styles["tag-button-text"], {
                    [styles["tag-button-active"]]: popupState
                })}>
                    Add tags
                </div>
            </div>
        </button>
        <Popup open={popupState} defaultOpen
            onClose={() => setPopupState(false)}
            position="top right"
            nested
            className={styles["popup"]}
            contentStyle={{
                top: popupPosition?.y ?? 0,
                left: popupPosition?.x ?? 0
            }}
        >
            {popupState &&
                <div onClick={(e) => e.stopPropagation()}
                    className={cn(styles["tag-popup"], "add-tag-popup")}>
                    <div className={styles["header"]}>
                        Add tag
                    </div>
                    <div className={styles["body"]}>
                        {getTagList(allTags.tags, track.tags)}
                    </div>
                    <CreateTag track={track} closePopup={() => setPopupState(false)}></CreateTag>
                </div>
            }
        </Popup>
    </>;
}

export default AddTag;