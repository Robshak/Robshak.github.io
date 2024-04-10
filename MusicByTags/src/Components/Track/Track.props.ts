import { Track } from "../../interfaces/Track.interface";
import { Tag } from "../../interfaces/tag.interface";


export interface TrackItemProps {
    index: number;
    className?: string;
    track: Track;
    tags: Tag[];
    focusActive: boolean;
}