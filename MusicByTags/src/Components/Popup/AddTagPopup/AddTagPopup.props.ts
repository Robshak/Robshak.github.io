import { Track } from "../../../interfaces/Track.interface";
import { Tag } from "../../../interfaces/tag.interface";
import { ObjectPosition } from "../../Context/Contextmenu/Contextmenu.context";

export interface AddPopupProps {
    popupPosition: ObjectPosition;
    onClose: () => void;
    track: Track;
    allTags: Tag[];
}