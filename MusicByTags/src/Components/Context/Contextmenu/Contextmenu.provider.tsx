import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { ContextMenu, ContextMenuItem, ContextMenuPosition } from "./Contextmenu.context";
import styles from "./Contextmenu.module.css";
import cn from "classnames";

export const ContextMenuProvider: FC<PropsWithChildren<object>> = ({ children }) => {
    const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>([]);
    const [position, setPosition] = useState<ContextMenuPosition>();
    const [blockState, setBlockState] = useState<boolean>(false);

    const setContextMenu = useCallback((items: ContextMenuItem[], position: ContextMenuPosition, block?: boolean) => {
        setContextMenuItems(items);
        setPosition(position);
        if (block != undefined) {
            setBlockState(block);
        }
        else {
            setBlockState(false);
        }
    }, []);

    const closeMenu = useCallback(() => {
        setPosition(undefined);
    }, []);

    useEffect(() => {
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