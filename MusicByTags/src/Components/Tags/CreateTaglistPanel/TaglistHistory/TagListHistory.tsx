import styles from "./TaglistHistory.module.css";
import DynamicTaglist from "../DynamicTaglist/DynamicTaglist";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { CurrentDynamicTagsStateActions } from "../../../../Store/TagsSlices/currentDynamicTags";

function TaglistHistory({ className }: { className?: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const { historyDynamicTags } = useSelector((s: RootState) => s.historyDynamicTags);

    return (
        <div className={cn(styles["histopry-tags"], className)}>
            {historyDynamicTags.map((dynamicTags, index) => {
                return <DynamicTaglist key={index}
                    historyId={index}
                    onClick={() => {
                        dispatch(CurrentDynamicTagsStateActions.setDynamicTags(dynamicTags));
                    }}
                    dynamicTags={dynamicTags}
                    className={styles["history-list"]}></DynamicTaglist>;
            })}
        </div>
    );
}

export default TaglistHistory;
