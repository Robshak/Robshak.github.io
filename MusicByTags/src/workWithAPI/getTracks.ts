import axios from "axios";
import { TOKEN } from "./getTOKEN";
import { Track } from "../interfaces/Track.interface";
import { TrackFromSpotify } from "../interfaces/TrackFromSpotify.interface";

// Function to convert duration to text
export function durationToText(duration_ms: number) {
    duration_ms /= 1000;
    const minutes = String(Math.floor(duration_ms / 60));
    let seconds = String(Math.floor(duration_ms % 60));
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }
    const durationText: string = `${minutes}:${seconds}`;
    return durationText;
}

// Fetches a single track and transforms it into a convenient format
export async function getTrack(searchString: string): Promise<Track | undefined> {
    const token = localStorage.getItem(TOKEN); // Token required for the request

    const options = {
        method: "GET",
        // url: `https://api.spotify.com/v1/tracks/${searchString}?market=DE`,
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent("baby blue")}&type=track`,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request<TrackFromSpotify>(options);
        // console.log(response.data);
        const data = response.data;
        if (data.preview_url) {
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
                album: data.album.name,
                tags: []
            };
            // console.log(completeTrack);
            return completeTrack;
        }
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

// Makes a batch request for all the required tracks at once
export async function getTracksById(trackIds: string[]) {
    let res = await Promise.all(trackIds.map(i => getTrack(i)));
    res.filter(track => typeof track != "undefined");
    let cnt = -1;
    res = res.map(track => {
        cnt++;
        if (track) {
            return { ...track, number: cnt };
        }
        else {
            cnt--;
        }
    });
    return res;
}
