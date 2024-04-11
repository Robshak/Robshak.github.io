import { useDispatch } from "react-redux";
import { Tag } from "../../interfaces/tag.interface";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";
import { AppDispatch } from "../../Store/store";
import { useState } from "react";
import { openTagsNowStateActions } from "../../Store/openTagsNow.slice";

function TagItem({ tag, status }: { tag: Tag, status: boolean }) { //FIX - вынести в props
    const dispatch = useDispatch<AppDispatch>();
    const [currentStatus, setCurrentStatus] = useState<boolean>(status);

    const toggleTrack = () => {
        if (currentStatus) {
            dispatch(openTagsNowStateActions.delTag(tag));
        }
        else {
            dispatch(openTagsNowStateActions.addTag(tag));
        }
        setCurrentStatus(s => !s);
    };

    return <div onClick={toggleTrack} className={styles["wrapper"]}>
        <TagBlock tag={tag} className={styles["tag-block"]}></TagBlock>
        <div className={cn(styles["tag-status"], {
            [styles["added-tag"]]: currentStatus
        })}></div>
    </div>;
}

export default TagItem;