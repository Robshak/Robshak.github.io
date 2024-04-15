import styles from "./InputTags.module.css";
import DynamicTaglist from "../DynamicTaglist/DynamicTaglist";
import cn from "classnames";
import { useState } from "react";
import DynamicTagPopup from "../../../Popup/DynamicTagPopup/DynamicTagPopup";
import { RootState } from "../../../../Store/store";
import { useSelector } from "react-redux";

// Object - list of tag sets used for track selection
function InputTags({ className }: { className?: string }) {
    const [openState, setOpenState] = useState<boolean>(false);
    const { dynamicTags } = useSelector((s: RootState) => s.currentDynamicTags);

    // Open popup for configuring and adding a new set of tags
    const addTag = () => {
        setOpenState(true);
    };

    return (<>
        <div className={cn(styles["input-tags"], className)}>
            <DynamicTaglist
                className={styles["input-list"]}
                dynamicTags={dynamicTags}
            ></DynamicTaglist>
            <button onClick={addTag} className={cn(styles["add-button"], {
                [styles["active"]]: openState
            })}>
                <img src="plusIcon.svg" alt="" />
            </button>
        </div>
        {openState && <DynamicTagPopup
            dynamicTagId={0}
            favoriteTags={[]}
            onClose={() => { setOpenState(false); }}
        >
        </DynamicTagPopup>}
    </>
    );
}

export default InputTags;
