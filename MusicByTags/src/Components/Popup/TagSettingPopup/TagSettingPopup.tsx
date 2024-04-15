import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./TagSettingPopup.module.css";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { AppDispatch, RootState } from "../../../Store/store";
import { Tag } from "../../../interfaces/tag.interface";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import cn from "classnames";
import { TagSettingPopupProps } from "./TagSettingPopup.props";

// Interface for retrieving the desired values from the form
export type CreateTagForm = {
    tagName: {
        value: string
    },
    color: {
        value: string
    }
}

// Popup for tag settings
function TagSettingPopup({ reworkTag, track, onClose }: TagSettingPopupProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [openState, setOpenState] = useState(true);
    const { tags } = useSelector((s: RootState) => s.tagList);
    const inputElement = useRef<any>(null);

    // Focus on input
    useEffect(() => {
        if (inputElement.current) {
            inputElement.current.focus();
        }
    }, []);

    // Apply changes
    const submit = (e: FormEvent) => {
        e.preventDefault(); // To disable the default behavior of the form
        const target = e.target as typeof e.target & CreateTagForm;
        const { tagName, color } = target;
        if (color.value) { // If this is a correct invocation
            if (reworkTag) { // If we are changing the tag
                if (!tags.find(tg => tg.name == tagName.value)) { // If there is no tag with the new name
                    const newValue: Tag = { // Create new tag
                        name: (tagName.value.length ? tagName.value : reworkTag.name),
                        color: color.value,
                        private: false
                    };
                    dispatch(taglistOnTrackStateActions.editTagOnAllTracks({ // Apply changes for all tracks
                        tagName: reworkTag.name,
                        newValue
                    }));
                    dispatch(taglistActions.editTag({ // Apply changes for tag list
                        tagName: reworkTag.name,
                        newValue
                    }));
                }
            }
            else { // If just add new tag
                dispatch(taglistActions.addTag({ name: tagName.value, color: color.value } as Tag)); // добавим его в список тегов
            }
            setOpenState(false); // Close popup
        }
    };

    // Button for removing a tag from the track
    const putAwayTag = () => {
        if (!reworkTag || !track) {
            return;
        }
        dispatch(taglistOnTrackStateActions.deleteTagOnTrack({
            track,
            tag: reworkTag
        }));
    };

    return <Popup open={openState}
        onClose={() => {
            setOpenState(false);
            onClose();
        }}
        modal
    >
        <form className={styles["wrapper"]} onSubmit={submit}>
            <button onClick={() => { setOpenState(false); }} className={styles["cross"]}>
                <img src="/popupCrossIcon.svg" alt="" />
            </button>
            <div className={styles["header"]}>{reworkTag ? "Edit tag" : "Create new tag"}</div>
            <div className={styles["group-name"]}>
                <label htmlFor="tagName" className={styles["group-name-text"]}>Chose name: </label>
                <input required={reworkTag ? false : true}
                    autoComplete="off"
                    ref={inputElement}
                    placeholder={reworkTag?.name ?? "Chose tag name"}
                    maxLength={15}
                    type="text" name="tagName" id="tagName" className={styles["chose-name"]}
                />
            </div>
            <div className={styles["group-color"]}>
                <label htmlFor="color" className={styles["group-color-text"]}>Chose color </label>
                <input type="color" name="color" id="color" className={styles["chose-color"]}
                    defaultValue={reworkTag?.color ?? "#000"}
                />
            </div>
            <div className={styles["buttons"]}>
                <button
                    onClick={putAwayTag}
                    className={cn(styles["putaway-tag"], styles["button"])}
                >Remove</button>
                <button
                    className={cn(styles["create-tag"], styles["button"])}
                >{reworkTag ? "Edit" : "Create"}</button>
            </div>
        </form>
    </Popup>;
}

export default TagSettingPopup;