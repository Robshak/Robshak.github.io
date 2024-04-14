import { useDispatch } from "react-redux";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";
import { AppDispatch } from "../../../Store/store";
import { MouseEvent, useCallback, useMemo, useState } from "react";
import { openTagsNowStateActions } from "../../../Store/TagsSlices/openTagNow.slice";
import { TagItemProps } from "./TagItem.props";
import { ContextMenuItem, ContextMenuPosition } from "../../Context/Contextmenu/Contextmenu.context";
import { taglistOnTrackStateActions } from "../../../Store/TagsSlices/tagListOnTrack..slice";
import { taglistActions } from "../../../Store/TagsSlices/tagList.slice";
import { useContextMenu } from "../../Hooks/useContextMenu";
import TagSettingPopup from "../../Popup/TagSettingPopup/TagSettingPopup";

// import { openTagsNowStateActions } from "../../Store/openTagsNow.slice";

function TagItem({ tag, status, track }: TagItemProps) { //FIX - вынести в props
    const dispatch = useDispatch<AppDispatch>();
    const [currentStatus, setCurrentStatus] = useState<boolean>(status);
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
                setCurrentStatus(false);
                if (!track) {
                    return;
                }
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


    function toggleTrack() {
        if (currentStatus) {
            dispatch(openTagsNowStateActions.delTag(tag));
        }
        else {
            dispatch(openTagsNowStateActions.addTag(tag));
        }
        setCurrentStatus(s => !s);
    }

    return <>
        <div onClick={toggleTrack} className={styles["wrapper"]}
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