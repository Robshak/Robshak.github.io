import { useDispatch } from "react-redux";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";
import { AppDispatch } from "../../../Store/store";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";
import { TagItemProps } from "./TagItem.props";
import { ContextMenuItem } from "../../Context/Contextmenu/Contextmenu.context";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { useContextMenu } from "../../Hooks/useContextMenu";
import TagSettingPopup from "../../Popup/TagSettingPopup/TagSettingPopup";
import { ObjectPosition } from "../../../interfaces/ObjectPosition";

// Object - tag, as an item in the tag settings tag list
function TagItem({ tag, status, track }: TagItemProps) {
    const dispatch = useDispatch<AppDispatch>();
    const [currentStatus, setCurrentStatus] = useState<boolean>(status);
    const { setContextMenu } = useContextMenu();
    const [openReworkPopup, setOpenReworkPopup] = useState<boolean>(false);

    // Context menu
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
                setCurrentStatus(false);
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

    // Create context menu
    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ObjectPosition, tag.private);
    }, [setContextMenu, contextMenu, tag.private]);

    // Add / remove tag from tag set
    function toggleTag() {
        if (currentStatus) {
            dispatch(openTagsNowStateActions.deleteTag(tag));
        }
        else {
            dispatch(openTagsNowStateActions.addTag(tag));
        }
        setCurrentStatus(s => !s);
    }

    return <>
        <div onClick={toggleTag} className={styles["wrapper"]}
            onContextMenu={handleContextMenu}>
            <TagBlock tag={tag} className={styles["tag-block"]} track={track}></TagBlock>
            <div className={cn(styles["tag-status"], {
                [styles["added-tag"]]: currentStatus
            })}></div>
        </div>
        {openReworkPopup && <TagSettingPopup
            reworkTag={tag}
            onClose={() => setOpenReworkPopup(false)}
        ></TagSettingPopup>}
    </>;
}

export default TagItem;
