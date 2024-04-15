import { Track } from "../../../interfaces/Track.interface";
import { Tag } from "../../../interfaces/tag.interface";

export interface TagSettingPopupProps {
    reworkTag?: Tag,
    track?: Track,
    onClose: () => void
}