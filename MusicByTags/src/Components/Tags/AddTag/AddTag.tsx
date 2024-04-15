import styles from "./AddTag.module.css";
import { AddTagProps } from "./AddTag.props";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import cn from "classnames";
import { MouseEvent, useState } from "react";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";
import AddPopup from "../../Popup/AddTagPopup/AddTagPopup";
import { ObjectPosition } from "../../../interfaces/ObjectPosition";

// Object - button with opening popup to modify the set of tags under the track
function AddTag({ track }: AddTagProps) {
    const dispatch = useDispatch<AppDispatch>();
    const allTags = useSelector((s: RootState) => s.tagList);
    const [popupState, setPopupState] = useState(false);
    const [popupPosition, setPopupPosition] = useState<ObjectPosition>();

    // Open popup
    const setTags = (e: MouseEvent) => {
        if (!track) {
            return;
        }

        // To prevent the popup from falling behind the display when clicked from the bottom of the screen, handle this case
        let plus = 0;
        const windowHeight = window.innerHeight;
        if (windowHeight - e.clientY < 300) {
            plus = -300;
        }

        setPopupPosition({ x: e.clientX, y: e.clientY + plus }); // Set position for popup
        dispatch(openTagsNowStateActions.setTags(track.tags)); // Pass selected tags
        setPopupState(s => !s);
        e.stopPropagation();
    };

    return <>
        <button
            onClick={setTags}
            className={cn(styles["tag-button-wrapper"], {
                [styles["tag-button-active"]]: popupState
            })}
            value={"unClicked"}>
            <div className={styles["tag-button"]}>
                <div className={cn(styles["tag-button-constent"])}>
                    <img src="/plusIcon.svg" alt="" />
                </div>
            </div>
        </button>
        {popupState &&
            <AddPopup
                popupPosition={popupPosition ?? { x: 0, y: 0 }}
                onClose={() => setPopupState(false)}
                track={track}
                allTags={allTags.tags}
            ></AddPopup>
        }
    </>;
}

export default AddTag;
