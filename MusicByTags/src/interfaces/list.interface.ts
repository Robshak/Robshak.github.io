import { Track } from "./Track.interface";
import { Tag } from "./tag.interface";

export interface List {
    tracks: Track[];
    tags: Tag[];
}