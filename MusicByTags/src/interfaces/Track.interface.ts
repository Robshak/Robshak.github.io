export interface Track {
    id: string
    number: number
    name: string
    img: string
    durationMs: number
    durationText: string
    artists: string
    album: string
    previewUrl: string
    tags?: string[]
}