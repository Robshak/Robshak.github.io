import TagBlock from "../../TagBlock/TagBlock";
import { CurrentDynamicTagsStateActions } from "../../../../Store/TagsSlices/currentDynamicTags";
import { DynamicTagProps } from "./DynamicTag.props";
import { useContextMenu } from "../../../Hooks/useContextMenu";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { ContextMenuItem, ContextMenuPosition } from "../../../Context/Contextmenu/Contextmenu.context";
import DynamicTagPopup from "../../../Popup/DynamicTagPopup/DynamicTagPopup";
import { Tag } from "../../../../interfaces/tag.interface";
import styles from "./DynamicTag.module.css";
import cn from "classnames";

const dynamicTagToString = (tags: Tag[]): string => {
    let res = "";
    for (const tg of tags) {
        res += `${tg.name} / `;
    }
    res = res.slice(0, -3);
    return res;
};

function DynamicTagItem({ currentDynamicTag }: DynamicTagProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { setContextMenu } = useContextMenu();
    const [openReworkPopup, setOpenReworkPopup] = useState<boolean>(false);
    const { tags } = useSelector((s: RootState) => s.tagList);
    const [currentTags, setCurrentTags] = useState<Tag[]>(currentDynamicTag.tags);
    const [currentColor, setCurrentCololr] = useState<string>("");

    useEffect(() => {
        if (!currentDynamicTag.tags.length) {
            dispatch(CurrentDynamicTagsStateActions.deleteDynamicTag(currentDynamicTag));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        currentDynamicTag = {
            id: currentDynamicTag.id,
            tags: currentDynamicTag.tags
                .filter(tg => {
                    const neefTag = tags.find(tg2 => tg2.name == tg.name);
                    if (neefTag) {
                        return true;
                    }
                    dispatch(CurrentDynamicTagsStateActions.deleteTagOnDynamicTag({
                        id: currentDynamicTag.id,
                        tag: tg
                    }));
                    return false;
                })
                .map(tg => {
                    const neefTag = tags.find(tg2 => tg2.name == tg.name);
                    if (!neefTag) {
                        return tg;
                    }
                    tg = neefTag;
                    return tg;
                })
        };
        if (currentDynamicTag.tags.length) {
            setCurrentCololr(currentDynamicTag.tags[0].color);
            setCurrentTags(currentDynamicTag.tags);
        }
    }, [currentDynamicTag, dispatch, tags]);

    const contextMenu = useMemo(() => [
        {
            name: "Rework template",
            onClick: () => {
                setOpenReworkPopup(true);
            }
        },
        {
            name: "Delete template",
            onClick: () => {
                dispatch(CurrentDynamicTagsStateActions.deleteDynamicTag(currentDynamicTag));
            }
        }
    ] as ContextMenuItem[], [currentDynamicTag, dispatch]);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX, clientY } = e;

        if (!setContextMenu) {
            return;
        }

        setContextMenu(contextMenu, { x: clientX, y: clientY } as ContextMenuPosition);
    }, [setContextMenu, contextMenu]);

    const addTagPopupOpen = () => {
        setOpenReworkPopup(true);
    };

    return (
        <>
            {currentDynamicTag.tags.length &&
                <TagBlock tag={{
                    color: currentColor,
                    name: dynamicTagToString(currentTags)
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
