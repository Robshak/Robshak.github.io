import { FormEvent, useState } from "react";
import styles from "./TagSettingPopup.module.css";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { taglistActions } from "../../../Store/tagList.slice";
import { AppDispatch, RootState } from "../../../Store/store";

export type CreateTagForm = {
    tagName: {
        value: string
    },
    color: {
        value: string
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TagSettingPopup({ reworkName, onClose }: { reworkName?: string, onClose: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [openState, setOpenState] = useState(true);
    const { tags } = useSelector((s: RootState) => s.tagList);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & CreateTagForm;
        const { tagName, color } = target;
        if (tagName.value && color.value) {
            if (reworkName) {
                if (!tags.find(tg => tg.name == tagName.value)) {
                    dispatch(taglistActions.reworkTag({
                        tagName: reworkName,
                        newValue: { name: tagName.value, color: color.value }
                    }));
                }
                // dispatch(taglistOnTrackStateActions.deleteTagOnAllTracks({
                //     name: tagName.value,
                //     color: color.value
                // }));
            }
            else {
                dispatch(taglistActions.addTag({ name: tagName.value, color: color.value }));
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
            <div className={styles["header"]}>{reworkName ? "Rework tag" : "Create new tag"}</div>
            <div className={styles["group-name"]}>
                <label htmlFor="tagName" className={styles["group-name-text"]}>Chose name: </label>
                <input required autoComplete="off" autoFocus placeholder={reworkName ?? "Chose tag name"}
                    type="text" name="tagName" id="tagName" className={styles["chose-name"]}
                />
            </div>
            <div className={styles["group-color"]}>
                <label htmlFor="color" className={styles["group-color-text"]}>Chose color </label>
                <input type="color" name="color" id="color" className={styles["chose-color"]} />
            </div>
            <button className={styles["create-tag"]}>{reworkName ? "Rework" : "Create"}</button>
        </form>
    </Popup>;
}

export default TagSettingPopup;