export interface Track {
    id: string
    name: string
    img: string
    durationMs: number
    durationText: string
    artists: string
    album: string
    tags?: string[]
}