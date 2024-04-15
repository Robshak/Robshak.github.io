import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { ContextMenu, ContextMenuItem } from "./Contextmenu.context";
import styles from "./Contextmenu.module.css";
import cn from "classnames";
import { ObjectPosition } from "../../../interfaces/ObjectPosition";

// Object for creating contextual menus with any buttons
export const ContextMenuProvider: FC<PropsWithChildren<object>> = ({ children }) => {
    const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
    const [position, setPosition] = useState<ObjectPosition>();
    const [blockState, setBlockState] = useState<boolean>(false);

    // Create contextual menus
    const setContextMenu = useCallback((items: ContextMenuItem[], position: ObjectPosition, block?: boolean) => {
        setContextMenuItems(items);
        position.y -= 30 * items.length + 30;
        setPosition(position);
        if (block != undefined) {
            setBlockState(block);
        }
        else {
            setBlockState(false);
        }
    }, []);

    // Removing the position upon menu closure
    const closeMenu = useCallback(() => {
        setPosition(undefined);
    }, []);

    // Handling the disappearance of the contextual menu upon clicking
    useEffect(() => {
        document.getElementById("popup-root")?.addEventListener("click", closeMenu); // Upon clicking on the popup
        document.body?.addEventListener("click", closeMenu); // Upon clicking on the another object

        return () => { // Unlinking dependencies
            document.getElementById("popup-root")?.removeEventListener("click", closeMenu);
            document.body?.removeEventListener("click", closeMenu);
        };
    }, [closeMenu]);

    return <ContextMenu.Provider value={{ setContextMenu }}>
        {!!position && (
            <ul
                className={cn(styles["context-menu"], {
                    [styles["block"]]: blockState
                })}
                style={{ left: position.x, top: position.y }}
            >
                {contextMenuItems.map((item, index) => (
                    <li key={index}
                        className={styles["context-menu-item"]}
                        onClick={item.onClick}
                    >{item.name}
                    </li>
                ))}
            </ul>
        )}
        {children}
    </ContextMenu.Provider>;
};