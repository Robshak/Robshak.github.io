import { Track } from "../../../interfaces/Track.interface";


export interface TrackItemProps {
    index: number;
    className?: string;
    track: Track;
    list: Track[];
    focusActive: boolean;
}