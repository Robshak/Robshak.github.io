import { createContext } from "react";
import { ObjectPosition } from "../../../interfaces/ObjectPosition";

// Interface button from contextual menu
export interface ContextMenuItem {
    name: string;
    onClick: () => void;
}

// Interface contextual menu
interface ContextMenuModel {
    setContextMenu?: (items: ContextMenuItem[], position: ObjectPosition, block?: boolean) => void;
}

// Create context
export const ContextMenu = createContext<ContextMenuModel>({
    setContextMenu: () => { }
});