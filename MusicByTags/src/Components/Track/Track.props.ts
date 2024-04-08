import { Track } from "../../interfaces/Track.interface";


export interface TrackItemProps {
    index: number;
    className?: string;
    track: Track;
    playlist: (Track | undefined)[] | null
}