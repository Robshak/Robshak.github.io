import axios from "axios";
import { TOKEN } from "./getTOKEN";
import { Track } from "../interfaces/Track.interface";
import { TrackFromSpotify } from "../interfaces/TrackFromSpotify.interface";

export function durationToText(duration_ms: number) {
    duration_ms /= 1000;
    const minutes = String(Math.floor(duration_ms / 60));
    let seconds = String(Math.floor(duration_ms % 60));
    // if (minutes.length == 1) {
    //     minutes = "0" + minutes;
    // }
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }
    const durationText: string = `${minutes}:${seconds}`;
    return durationText;
}

export async function getTrack(searchString: string): Promise<Track | undefined> {
    const token = localStorage.getItem(TOKEN);

    const options = {
        method: "GET",
        url: `https://api.spotify.com/v1/tracks/${searchString}?market=DE`,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request<TrackFromSpotify>(options);
        const data = response.data;
        // console.log(data);
        const completeTrack: Track = {
            id: data.id,
            number: 0,
            name: data.name,
            img: data.album.images[0].url,
            // durationMs: data.duration_ms,
            // durationText: durationToText(data.duration_ms),
            durationMs: 30000,
            durationText: durationToText(30000),
            artists: data.artists.map(artist => artist.name).join(", "),
            previewUrl: data.preview_url,
            album: data.album.name
        };
        return completeTrack;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function getTracksById(trackIds: string[]) {
    let res = await Promise.all(trackIds.map(i => getTrack(i)));
    let cnt = 0;
    res = res.map(track => {
        cnt++;
        if (track) {
            return { ...track, number: cnt };
        }
    });
    return res;
}