import { Track } from "../../../interfaces/Track.interface";

export interface TaglistProps {
    track: Track | undefined;
    className?: string;
    maxWidth?: number;
}