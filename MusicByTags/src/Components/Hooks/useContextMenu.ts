import { useContext } from "react";
import { ContextMenu } from "../Context/Contextmenu/Contextmenu.context";

// Hook for create context
export const useContextMenu = () => useContext(ContextMenu);