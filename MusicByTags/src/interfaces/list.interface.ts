import { DynamicTag } from "../Store/TagsSlices/currentDynamicTags";
import { Track } from "./Track.interface";

export interface List {
    tracks: Track[];
    tags: DynamicTag[];
}