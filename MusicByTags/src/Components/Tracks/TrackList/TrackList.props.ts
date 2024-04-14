import { ReactNode } from "react";
import { DynamicTag } from "../../../Store/TagsSlices/currentDynamicTags";

export interface TrackListProps {
    tags: DynamicTag[];
    head: ReactNode;
}