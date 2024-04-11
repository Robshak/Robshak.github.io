import { useDispatch } from "react-redux";
import { Tag } from "../../interfaces/tag.interface";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";
import { AppDispatch } from "../../Store/store";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { openTagsNowStateActions } from "../../Store/openTagNow.slice";
import { useContextMenu } from "../Hooks/useContextMenu";
import { ContextMenuItem, ContextMenuPosition } from "../Context/Contextmenu/Contextmenu.context";
// import { openTagsNowStateActions } from "../../Store/openTagsNow.slice";

function TagItem({ tag, status }: { tag: Tag, status: boolean }) { //FIX - вынести в props
    const dispatch = useDispatch<AppDispatch>();
    const [currentStatus, setCurrentStatus] = useState<boolean>(status);
    const { setContextMenu } = useContextMenu();

    const contextMenu = useMemo(() => [
        {
            name: "Rework tag",
            onClick: () => { }
        },
        {
            name: "Delete tag",
            onClick: () => { }
        }
    ] as ContextMenuItem[], []);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ContextMenuPosition);
    }, [setContextMenu, contextMenu]);

    function toggleTrack() {
        if (currentStatus) {
            dispatch(openTagsNowStateActions.delTag(tag));
        }
        else {
            dispatch(openTagsNowStateActions.addTag(tag));
        }
        setCurrentStatus(s => !s);
    }

    return <div onClick={toggleTrack} className={styles["wrapper"]}
        onContextMenu={handleContextMenu}>
        <TagBlock tag={tag} className={styles["tag-block"]}></TagBlock>
        <div className={cn(styles["tag-status"], {
            [styles["added-tag"]]: currentStatus
        })}></div>
    </div>;
}

export default TagItem;