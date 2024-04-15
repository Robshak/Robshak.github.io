import { HTMLAttributes } from "react";
import { DynamicTag } from "../../../../interfaces/DynamicTag";

export interface DynamicTaglistProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    dynamicTags: DynamicTag[];
    historyId?: number;
}