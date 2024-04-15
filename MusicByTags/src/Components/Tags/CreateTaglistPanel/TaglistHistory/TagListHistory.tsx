import styles from "./TaglistHistory.module.css";
import DynamicTaglist from "../DynamicTaglist/DynamicTaglist";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { CurrentDynamicTagsStateActions } from "../../../../Store/TagsSlices/currentDynamicTags";
import { DynamicTag } from "../../../../interfaces/DynamicTag";

// Object - history of sets of tag lists
function TaglistHistory({ className }: { className?: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { historyDynamicTags } = useSelector((s: RootState) => s.historyDynamicTags);

    // Set a new value for the current list of sets
    const setInput = (dynamicTags: DynamicTag[]) => {
        dispatch(CurrentDynamicTagsStateActions.setDynamicTags(dynamicTags));
    };

    return (
        <div className={cn(styles["histopry-tags"], className)}>
            {historyDynamicTags.map((dynamicTags, index) => {
                return <DynamicTaglist key={index}
                    historyId={index}
                    onClick={() => {
                        setInput(dynamicTags);
                    }}
                    dynamicTags={dynamicTags}
                    className={styles["history-list"]}></DynamicTaglist>;
            })}
        </div>
    );
}

export default TaglistHistory;
