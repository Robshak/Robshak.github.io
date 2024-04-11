import { FormEvent, useState } from "react";
import styles from "./CreateTag.module.css";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { taglistActions } from "../../Store/tagList.slice";
import { Track } from "../../interfaces/Track.interface";
import { taglistOnTrackStateActions } from "../../Store/tagListOnTrack..slice";

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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & CreateTagForm;
        const { tagName, color } = target;
        if (tagName.value && color.value) {
            dispatch(taglistActions.addTag({ name: tagName.value, color: color.value }));
            setOpenState(false);
        }
    };

    const setTags = () => {
        dispatch(taglistOnTrackStateActions.setOnTrack({ track: track, tags: tags }));
        closePopup();
    };

    return <>
        <div className={styles["buttons-block"]}>
            <button onClick={() => { setOpenState(true); }} className={styles["create-tag"]}>Create tag</button>
            <button onClick={setTags} className={styles["ready"]}>Ready</button>
        </div>
        <Popup open={openState} modal>
            <form className={styles["wrapper"]} onSubmit={submit}>
                <button onClick={() => { setOpenState(false); }} className={styles["cross"]}>
                    <img src="/popupCrossIcon.svg" alt="" />
                </button>
                <div className={styles["header"]}>Create new tag</div>
                <div className={styles["group-name"]}>
                    <label htmlFor="tagName" className={styles["group-name-text"]}>Chose name: </label>
                    <input required autoComplete="off" autoFocus placeholder="Chose tag name"
                        type="text" name="tagName" id="tagName" className={styles["chose-name"]} />
                </div>
                <div className={styles["group-color"]}>
                    <label htmlFor="color" className={styles["group-color-text"]}>Chose color </label>
                    <input type="color" name="color" id="color" className={styles["chose-color"]} />
                </div>
                <button className={styles["create-tag"]}>Create</button>
            </form>
        </Popup>
    </>;
}

export default CreateTag;