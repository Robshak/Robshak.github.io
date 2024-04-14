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

function CreateTaglistPanel() {
    const dispatch = useDispatch<AppDispatch>();
    const { dynamicTags } = useSelector((s: RootState) => s.currentDynamicTags);
    const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    const clearInput = () => {
        dispatch(HistoryDynamicTagsStateActions.addDynamicTags(dynamicTags));
        dispatch(CurrentDynamicTagsStateActions.clear());
    };

    const contains = (first: Tag[], second: Tag[]) => {
        const firstNames = first.map(tg => tg.name);
        const secondNames = second.map(tg => tg.name);
        for (let i = 0; i < secondNames.length; i++) {
            if (firstNames.indexOf(secondNames[i]) == -1) return false;
        }
        return true;
    };

    const createPlaylist = () => {
        if (!dynamicTags.length) {
            return;
        }
        const newList = tracks.filter(tr => {
            for (const dtg of dynamicTags) {
                // console.log(dtg.tags, tr.tags);
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
                <div className={styles["block-text"]}>Chose tags: </div>
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
