import { DynamicTag } from "../../../Store/TagsSlices/currentDynamicTags";
import { Track } from "../../../interfaces/Track.interface";


export interface TrackItemProps {
    index: number;
    className?: string;
    track: Track;
    tags: DynamicTag[];
    focusActive: boolean;
}