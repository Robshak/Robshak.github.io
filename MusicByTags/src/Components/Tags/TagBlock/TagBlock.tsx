import styles from "./TagBlock.module.css";
import cn from "classnames";
import { TagBlockProps } from "./TagBlock.props";
import TagSettingPopup from "../../Popup/TagSettingPopup/TagSettingPopup";
import { ContextMenuItem, ContextMenuPosition } from "../../Context/Contextmenu/Contextmenu.context";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useContextMenu } from "../../Hooks/useContextMenu";
import { AppDispatch } from "../../../Store/store";
import { useDispatch } from "react-redux";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";

function TagBlock({ tag, track, className, ...props }: TagBlockProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { setContextMenu } = useContextMenu();
    const [openReworkPopup, setOpenReworkPopup] = useState<boolean>(false);

    const contextMenu = useMemo(() => [
        {
            name: "Rework tag",
            onClick: () => { setOpenReworkPopup(true); }
        },
        {
            name: "Delete tag",
            onClick: () => {
                dispatch(taglistOnTrackStateActions.deleteTagOnAllTracks(tag));
                dispatch(taglistActions.delTag(tag.name));
                dispatch(openTagsNowStateActions.delTag(tag));
            }
        },
        {
            name: "Put away",
            onClick: () => {
                if (!track) {
                    return;
                }
                console.log(track, tag);
                dispatch(taglistOnTrackStateActions.deleteTagOnTrack({
                    track,
                    tag
                }));
                dispatch(openTagsNowStateActions.delTag(tag));
            }
        }
    ] as ContextMenuItem[], [dispatch, tag, track]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ContextMenuPosition, tag.private);
    }, [setContextMenu, contextMenu, tag.private]);

    return <>
        <div className={styles["wrapper"]} {...props}
            onContextMenu={handleContextMenu}>
            <div className={cn(styles["tag"], className)} style={{ backgroundColor: tag.color }}>
                <div className={styles["tag-text"]}>{tag.name}</div>
            </div>
        </div>
        {openReworkPopup && <TagSettingPopup
            reworkTag={tag}
            onClose={() => setOpenReworkPopup(false)}
        ></TagSettingPopup>}
    </>;
}

export default TagBlock;