import { HTMLAttributes } from "react";
import { Tag } from "../../../interfaces/tag.interface";

export interface TagBlockProps extends HTMLAttributes<HTMLDivElement> {
    tag: Tag,
    className?: string
}