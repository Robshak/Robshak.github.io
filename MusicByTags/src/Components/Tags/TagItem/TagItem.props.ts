import { Track } from "../../../interfaces/Track.interface";
import { Tag } from "../../../interfaces/tag.interface";

export interface TagItemProps {
    tag: Tag;
    status: boolean;
    track?: Track;
}