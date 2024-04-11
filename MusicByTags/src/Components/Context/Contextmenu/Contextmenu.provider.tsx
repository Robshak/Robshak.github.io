import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { ContextMenu, ContextMenuItem, ContextMenuPosition } from "./Contextmenu.context";
import styles from "./Contextmenu.module.css";

export const ContextMenuProvider: FC<PropsWithChildren<object>> = ({ children }) => {
    const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
    const [position, setPosition] = useState<ContextMenuPosition>();

    const setContextMenu = useCallback((items: ContextMenuItem[], position: ContextMenuPosition) => {
        setContextMenuItems(items);
        setPosition(position);
    }, []);

    const closeMenu = useCallback(() => {
        setPosition(undefined);
    }, []);

    useEffect(() => {
        console.log("here");
        document.getElementById("popup-root")?.addEventListener("click", closeMenu);
        document.body?.addEventListener("click", closeMenu);

        return () => {
            document.getElementById("popup-root")?.removeEventListener("click", closeMenu);
            document.body?.removeEventListener("click", closeMenu);
        };
    }, [closeMenu]);

    return <ContextMenu.Provider value={{ setContextMenu }}>
        {!!position && (
            <ul
                className={styles["context-menu"]}
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