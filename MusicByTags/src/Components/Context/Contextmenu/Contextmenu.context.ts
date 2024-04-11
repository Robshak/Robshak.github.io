import { createContext } from "react";

export interface ContextMenuPosition {
    x: number;
    y: number;
}

export interface ContextMenuItem {
    name: string;
    onClick: () => void;
}

interface ContextMenuModel {
    setContextMenu?: (items: ContextMenuItem[], position: ContextMenuPosition) => void;
}

export const ContextMenu = createContext<ContextMenuModel>({
    setContextMenu: () => { }
});