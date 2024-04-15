import axios from "axios";
import { SearchFromSpotify } from "../interfaces/searchData.interface";
import { TOKEN } from "./getTOKEN";
import { getTracksById } from "./getTracks";

// Converts the given response into a convenient format for processing
async function reworkData(data: SearchFromSpotify | undefined) {
    if (data) {
        const tracks = await getTracksById(data.tracks.items.map(i => i.id));
        return tracks;
    }
    return [];
}

// Returns a single page of tracks for the provided URL
async function getPage(url: string): Promise<SearchFromSpotify | undefined> {
    const token = localStorage.getItem(TOKEN); // Token required for the request

    const options = {
        method: "GET",
        url: url,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    };

    try {
        const response: any = await axios.request<SearchFromSpotify>(options)
            .then(d => d)
            .catch(async e => { // Handling error for too many requests
                if (e.response.status == 429) {
                    return await new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(getPage(url));
                        }, 100);
                    });
                }
            });
        if (response) {
            const data = response.data;
            return data;
        }
    } catch (error) {
        console.error(error);
    }
}

// Returns a list of tracks in the required format based on the provided search string
export async function searchAPI(searchString: string) {
    try {
        const url = `https://api.spotify.com/v1/search?q=${searchString}&type=track&limit=50`;
        return await reworkData(await getPage(url));
    } catch (error) {
        console.error(error);
    }
}
