import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./TagSettingPopup.module.css";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { AppDispatch, RootState } from "../../../Store/store";
import { Tag } from "../../../interfaces/tag.interface";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";

export type CreateTagForm = {
    tagName: {
        value: string
    },
    color: {
        value: string
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TagSettingPopup({ reworkTag: reworkTag, onClose }: { reworkTag?: Tag, onClose: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [openState, setOpenState] = useState(true);
    const { tags } = useSelector((s: RootState) => s.tagList);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputElement = useRef<any>(null);
    useEffect(() => {
        if (inputElement.current) {
            inputElement.current.focus();
        }
    }, []);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & CreateTagForm;
        const { tagName, color } = target;
        if (color.value) {
            if (reworkTag) {
                if (!tags.find(tg => tg.name == tagName.value)) {
                    const newValue: Tag = {
                        name: (tagName.value.length ? tagName.value : reworkTag.name),
                        color: color.value,
                        private: false
                    };
                    dispatch(taglistOnTrackStateActions.reworkTagOnAllTracks({
                        tagName: reworkTag.name,
                        newValue
                    }));
                    dispatch(taglistActions.reworkTag({
                        tagName: reworkTag.name,
                        newValue
                    }));
                }
            }
            else {
                dispatch(taglistActions.addTag({ name: tagName.value, color: color.value } as Tag));
            }
            setOpenState(false);
        }
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
            <div className={styles["header"]}>{reworkTag ? "Rework tag" : "Create new tag"}</div>
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
            <button className={styles["create-tag"]}>{reworkTag ? "Rework" : "Create"}</button>
        </form>
    </Popup>;
}

export default TagSettingPopup;