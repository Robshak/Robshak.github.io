import { Tag } from "./tag.interface";

export interface Track { // Interface for track
    id: string
    number: number
    name: string
    img: string
    durationMs: number
    durationText: string
    artists: string
    album: string
    previewUrl: string
    tags: Tag[]
}