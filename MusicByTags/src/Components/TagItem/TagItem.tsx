import { useDispatch } from "react-redux";
import { Tag } from "../../interfaces/tag.interface";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";
import { AppDispatch } from "../../Store/store";
import { Track } from "../../interfaces/Track.interface";
import { taglistOnTrackStateActions } from "../../Store/tagListOnTrack..slice";

function TagItem({ tag, status, track }: { tag: Tag, status: boolean, track: Track }) { //FIX - вынести в props
    const dispatch = useDispatch<AppDispatch>();

    const toggleTrack = () => {
        if (!status) {
            dispatch(taglistOnTrackStateActions.addTagOnTrack({ tag, track }));
        }
        else {
            dispatch(taglistOnTrackStateActions.deleteTrack({ tag, track }));
        }
    };

    return <div onClick={toggleTrack} className={styles["wrapper"]}>
        <TagBlock tag={tag} className={styles["tag-block"]}></TagBlock>
        <div className={cn(styles["tag-status"], {
            [styles["added-tag"]]: status
        })}></div>
    </div>;
}

export default TagItem;