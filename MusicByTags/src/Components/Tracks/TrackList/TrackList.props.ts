import { ReactNode } from "react";
import { Track } from "../../../interfaces/Track.interface";

export interface TrackListProps {
    changerList: (newValue: Track[]) => void;
    head: ReactNode;
    list: Track[]
}