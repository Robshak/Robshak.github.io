import { useContext } from "react";
import { ContextMenu } from "../Context/Contextmenu/Contextmenu.context";

export const useContextMenu = () => useContext(ContextMenu);