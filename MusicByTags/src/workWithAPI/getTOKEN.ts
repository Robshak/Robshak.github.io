import axios from "axios";

export const client_id = "342af3e686ee41a9ae548be73e9b4f74";
export const client_secret = "b47aec4e0e704aa98d2cf8044a075b15";

// Interface describing the API response type
export interface GetToken {
    access_token: string
    token_type: string
    expires_in: number
}

export const TOKEN = "token";

export async function getTOKEN() {
    try {
        const token_url = "https://accounts.spotify.com/api/token";
        const data = {
            grant_type: "client_credentials",
            client_id: client_id,
            client_secret: client_secret
        };

        const response = await axios.post<GetToken>(token_url, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        localStorage.setItem(TOKEN, response.data.access_token);
    } catch (e) {
        console.error(e);
    }
}