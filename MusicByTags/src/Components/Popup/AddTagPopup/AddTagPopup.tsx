import styles from "./AddPopup.module.css";
import cn from "classnames";
import Popup from "reactjs-popup";
import { useState } from "react";
import { AddPopupProps } from "./AddTagPopup.props";
import CreateTag from "../../Tags/CreateTag/CreateTag";
import { getTagList } from "../../../workWithTags/getTagList";

// Popup for tags control
function AddPopup({ popupPosition, onClose, track, allTags }: AddPopupProps) {
    const [popupState, setPopupState] = useState(true);

    return <>
        <Popup open={popupState}
            onClose={() => {
                setPopupState(false);
                onClose();
            }}
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
                        {getTagList(allTags, track.tags, track)}
                    </div>
                    <CreateTag track={track} closePopup={() => {
                        setPopupState(false);
                        onClose();
                    }}></CreateTag>
                </div>
            }
        </Popup>
    </>;
}

export default AddPopup;