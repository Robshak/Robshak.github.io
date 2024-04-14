import { HTMLAttributes } from "react";
import { DynamicTag } from "../../../../Store/TagsSlices/currentDynamicTags";

export interface DynamicTaglistProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    dynamicTags: DynamicTag[];
    historyId?: number;
}