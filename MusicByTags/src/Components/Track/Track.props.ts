import { Track } from "../../interfaces/Track.interface";

export interface TrackItemProps {
    className?: string;
    track: Track;
    playlist: (Track | undefined)[] | null
}