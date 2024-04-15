import TagBlock from "../../TagBlock/TagBlock";
import { CurrentDynamicTagsStateActions } from "../../../../Store/TagsSlices/currentDynamicTags";
import { DynamicTagProps } from "./DynamicTag.props";
import { useContextMenu } from "../../../Hooks/useContextMenu";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { ContextMenuItem } from "../../../Context/Contextmenu/Contextmenu.context";
import DynamicTagPopup from "../../../Popup/DynamicTagPopup/DynamicTagPopup";
import { Tag } from "../../../../interfaces/tag.interface";
import styles from "./DynamicTag.module.css";
import cn from "classnames";
import { ObjectPosition } from "../../../../interfaces/ObjectPosition";

// Convert a set of tags into a string
const dynamicTagToString = (tags: Tag[]): string => {
    let res = "";
    for (const tg of tags) {
        res += `${tg.name} / `;
    }
    res = res.slice(0, -3);
    return res;
};

// Object for a set of tags
function DynamicTagItem({ currentDynamicTag }: DynamicTagProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { setContextMenu } = useContextMenu();
    const [openReworkPopup, setOpenReworkPopup] = useState<boolean>(false);
    const { tags } = useSelector((s: RootState) => s.tagList);
    const [currentTags, setCurrentTags] = useState<Tag[]>(currentDynamicTag.tags);
    const [currentColor, setCurrentCololr] = useState<string>("");

    // Set settings for the set of tags
    useEffect(() => {
        if (currentDynamicTag.tags.length) {
            setCurrentCololr(currentDynamicTag.tags[0].color);
            setCurrentTags(currentDynamicTag.tags);
        }
    }, [currentDynamicTag, dispatch, tags]);

    // Create context menu
    const contextMenu = useMemo(() => [
        { // Edit template
            name: "Edit template",
            onClick: () => {
                setOpenReworkPopup(true);
            }
        },
        { // Delete template
            name: "Delete template",
            onClick: () => {
                dispatch(CurrentDynamicTagsStateActions.deleteDynamicTag(currentDynamicTag));
            }
        }
    ] as ContextMenuItem[], [currentDynamicTag, dispatch]);

    // Invoke context menu
    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ObjectPosition);
    }, [setContextMenu, contextMenu]);

    // Open popup to modify the set of tags
    const addTagPopupOpen = () => {
        setOpenReworkPopup(true);
    };

    return (
        <>
            {currentDynamicTag.tags.length &&
                <TagBlock tag={{
                    color: currentColor,
                    name: dynamicTagToString(currentTags),
                    private: false
                }}
                    onClick={addTagPopupOpen}
                    onContextMenu={handleContextMenu}
                    style={{ flexGrow: 0 }}
                    className={cn(styles["dinamic-tag"], {
                        [styles["active"]]: openReworkPopup
                    })}
                ></TagBlock>
            }
            {openReworkPopup && <DynamicTagPopup
                onClose={() => setOpenReworkPopup(false)}
                dynamicTagId={currentDynamicTag.id}
                favoriteTags={currentTags}
            >
            </DynamicTagPopup>}
        </>
    );
}

export default DynamicTagItem;
