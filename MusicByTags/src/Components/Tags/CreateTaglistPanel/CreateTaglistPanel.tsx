import { useDispatch, useSelector } from "react-redux";
import MenuButton from "../../MenuButton/MenuButton";
import styles from "./CreateTaglistPanel.module.css";
import InputTags from "./InputTags/InputTags";
import TaglistHistory from "./TaglistHistory/TagListHistory";
import cn from "classnames";
import { AppDispatch, RootState } from "../../../Store/store";
import { CurrentDynamicTagsStateActions } from "../../../Store/TagsSlices/currentDynamicTags";
import { HistoryDynamicTagsStateActions } from "../../../Store/TagsSlices/dynamicTagsHistory";
import { Tag } from "../../../interfaces/tag.interface";
import { PlayerActions } from "../../../Store/CurrentTrackStateSlices/playerManager.slice";

// Object for creating a set of tags used for selecting tracks
function CreateTaglistPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const { dynamicTags } = useSelector((s: RootState) => s.currentDynamicTags);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    // Clear the current set of tags
    const clearInput = () => {
        dispatch(HistoryDynamicTagsStateActions.addDynamicTags(dynamicTags)); // Saved to history
        dispatch(CurrentDynamicTagsStateActions.clear()); // Cleared
    };

    // Check tag lists for inclusion of the second in the first
    const contains = (first: Tag[], second: Tag[]) => {
        const firstNames = first.map(tg => tg.name);
        const secondNames = second.map(tg => tg.name);
        for (let i = 0; i < secondNames.length; i++) {
            if (firstNames.indexOf(secondNames[i]) == -1) return false;
        }
        return true;
    };

    // Create a playlist based on the selected tags
    const createPlaylist = () => {
        if (!dynamicTags.length) {
            return;
        }
        const newList = tracks.filter(tr => {
            for (const dtg of dynamicTags) {
                if (contains(tr.tags, dtg.tags)) {
                    return true;
                }
            }

            return false;
        });
        dispatch(HistoryDynamicTagsStateActions.addDynamicTags(dynamicTags));
        dispatch(PlayerActions.setCreateList(newList));
    };

    return (
        <div className={styles["panel"]}>
            <h2 className={styles["header"]}>Create your playlist</h2>
            <div className={cn(styles["input-tag-panel"], styles["tag-panel"])}>
                <div className={styles["block-text"]}>Choose tags: </div>
                <InputTags className={styles["tags-box"]}></InputTags>
            </div>
            <div className={cn(styles["history-tag-panel"], styles["tag-panel"])}>
                <div className={styles["block-text"]}>Tags history: </div>
                <TaglistHistory className={styles["tags-box"]}></TaglistHistory>
            </div>
            <div className={styles["buttons"]}>
                <MenuButton
                    onClick={clearInput}
                    active={false}
                    className={styles["panel-button"]}
                >
                    Clear</MenuButton>
                <MenuButton
                    onClick={createPlaylist}
                    active={false}
                    className={styles["panel-button"]}
                >
                    Create</MenuButton>
            </div>
        </div>
    );
}

export default CreateTaglistPanel;
