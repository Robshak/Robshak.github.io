import { HTMLAttributes } from "react";
import { Tag } from "../../../interfaces/tag.interface";
import { Track } from "../../../interfaces/Track.interface";

export interface TagBlockProps extends HTMLAttributes<HTMLDivElement> {
    tag: Tag,
    className?: string
    track?: Track
}