import styles from "./TagBlock.module.css";
import cn from "classnames";
import { TagBlockProps } from "./TagBlock.props";
import TagSettingPopup from "../../Popup/TagSettingPopup/TagSettingPopup";
import { ContextMenuItem } from "../../Context/Contextmenu/Contextmenu.context";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { useContextMenu } from "../../Hooks/useContextMenu";
import { AppDispatch } from "../../../Store/store";
import { useDispatch } from "react-redux";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";
import { ObjectPosition } from "../../../interfaces/ObjectPosition";

// Object - tag
function TagBlock({ tag, track, className, mini, ...props }: TagBlockProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { setContextMenu } = useContextMenu();
    const [openReworkPopup, setOpenReworkPopup] = useState<boolean>(false);

    // Create context menu
    const contextMenu = useMemo(() => [
        { // Edit tag
            name: "Edit tag",
            onClick: () => { setOpenReworkPopup(true); }
        },
        { // Delete tag
            name: "Delete tag",
            onClick: () => {
                dispatch(taglistOnTrackStateActions.deleteTagOnAllTracks(tag));
                dispatch(taglistActions.deleteTag(tag.name));
                dispatch(openTagsNowStateActions.deleteTag(tag));
            }
        },
        { // Remove tag from current tag set
            name: "Remove",
            onClick: () => {
                if (!track) {
                    return;
                }
                dispatch(taglistOnTrackStateActions.deleteTagOnTrack({
                    track,
                    tag
                }));
                dispatch(openTagsNowStateActions.deleteTag(tag));
            }
        }
    ] as ContextMenuItem[], [dispatch, tag, track]);

    // Invoke context menu
    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, pageY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: pageY } as ObjectPosition, tag.private);
    }, [setContextMenu, contextMenu, tag.private]);

    // Open tag setting on click
    const onClick = () => {
        setOpenReworkPopup(true);
    };

    return <>
        {mini &&
            <div id="unClicked" className={styles["wrapper"]} {...props}
                onContextMenu={handleContextMenu}
                onClick={onClick}>
                <div className={cn(styles["tag"], className)} style={{ backgroundColor: tag.color }}>
                    <div className={styles["tag-text"]}>{tag.name}</div>
                </div>
            </div>
        }
        {!mini &&
            <div id="unClicked" className={styles["wrapper"]} {...props}>
                <div className={cn(styles["tag"], className)} style={{ backgroundColor: tag.color }}>
                    <div className={styles["tag-text"]}>{tag.name}</div>
                </div>
            </div>
        }
        {openReworkPopup && <TagSettingPopup
            reworkTag={tag}
            track={track}
            onClose={() => setOpenReworkPopup(false)}
        ></TagSettingPopup>}
    </>;
}

export default TagBlock;
