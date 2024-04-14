import styles from "./DynamicTaglist.module.css";
import DynamicTagItem from "../DynamicTag/DynamicTag";
import { DynamicTaglistProps } from "./DynamicTaglist.props";
import cn from "classnames";
import { useContextMenu } from "../../../Hooks/useContextMenu";
import { MouseEvent, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Store/store";
import { ContextMenuItem, ContextMenuPosition } from "../../../Context/Contextmenu/Contextmenu.context";
import { HistoryDynamicTagsStateActions } from "../../../../Store/TagsSlices/dynamicTagsHistory";

function DynamicTaglist({ className, dynamicTags, historyId, ...props }: DynamicTaglistProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { setContextMenu } = useContextMenu();

    const contextMenu = useMemo(() => [
        {
            name: "Clear  history",
            onClick: () => {
                if (typeof historyId == "undefined") {
                    return;
                }
                dispatch(HistoryDynamicTagsStateActions.delDynamicTags(historyId));
            }
        }
    ] as ContextMenuItem[], [dispatch, historyId]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ContextMenuPosition);
    }, [setContextMenu, contextMenu]);

    return (
        <div className={cn(styles["dynamic-taglist"], className)}
            onContextMenu={typeof historyId != "undefined" ? handleContextMenu : () => { }}
            {...props}>
            {
                dynamicTags.map((dtg, index) => {
                    return <DynamicTagItem key={index} currentDynamicTag={dtg}></DynamicTagItem>;
                })
            }
        </div>
    );
}

export default DynamicTaglist;
