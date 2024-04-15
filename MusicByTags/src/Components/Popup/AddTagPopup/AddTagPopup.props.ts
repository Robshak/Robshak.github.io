import { ObjectPosition } from "../../../interfaces/ObjectPosition";
import { Track } from "../../../interfaces/Track.interface";
import { Tag } from "../../../interfaces/tag.interface";

export interface AddPopupProps {
    popupPosition: ObjectPosition;
    onClose: () => void;
    track: Track;
    allTags: Tag[];
}