import axios from "axios";
import { TOKEN } from "./getTOKEN";
import { Track } from "../interfaces/Track.interface";
import { TrackFromSpotify } from "../interfaces/TrackFromSpotify.interface";

function durationToText(duration_ms: number) {
    duration_ms /= 1000;
    let minutes = String(Math.floor(duration_ms / 60));
    let seconds = String(Math.ceil(duration_ms % 60));
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    if (seconds.length == 1) {
        seconds = "0" + minutes;
    }
    const durationText: string = `${minutes}:${seconds}`;
    return durationText;
}

export async function getTrack(searchString: string): Promise<Track | undefined> {
    const token = localStorage.getItem(TOKEN);

    const options = {
        method: "GET",
        url: `https://api.spotify.com/v1/tracks/${searchString}`,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request<TrackFromSpotify>(options);
        const data = response.data;
        const completeTrack: Track = {
            id: data.id,
            name: data.name,
            img: data.album.images[0].url,
            durationMs: data.duration_ms,
            durationText: durationToText(data.duration_ms),
            artists: data.artists.map(artist => artist.name).join(", "),
            album: data.album.name
        };
        return completeTrack;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function getTracksById(trackIds: string[]) {
    const res = await Promise.all(trackIds.map(i => getTrack(i)));
    // console.log(res);
    return res;
}