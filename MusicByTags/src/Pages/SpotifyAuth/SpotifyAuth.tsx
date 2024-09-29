import { useEffect, useState } from "react";
import axios from "axios";
import { REFRESH_TOKEN, TOKEN } from "../../workWithAPI/getTOKEN";
import { useNavigate } from "react-router-dom";

const clientId = "342af3e686ee41a9ae548be73e9b4f74";
const secret = "b47aec4e0e704aa98d2cf8044a075b15";
const scopes = "user-read-private user-read-email";

const getAuthUrl = (currentUrl: string) => {
    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(currentUrl)}`;
    return spotifyAuthUrl;
};

const SpotifyAuthComponent = () => {
  const [currentUrl] = useState<string>("https://silver-bonbon-26555e.netlify.app/");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const naviaget = useNavigate();

  useEffect(() => {
    // setCurrentUrl(window.location.href);
    const tokenFromStorage = localStorage.getItem(TOKEN);
    const codeFromUrl = new URLSearchParams(window.location.search).get("code");

    if (!tokenFromStorage && codeFromUrl) {
      getTokenFromCode(codeFromUrl);
    } 
    if (!tokenFromStorage) {
      window.location.href = getAuthUrl(currentUrl);
    } else {
      setAccessToken(tokenFromStorage);
    }
  }, []);

  const getTokenFromCode = async (code: string) => {
    try {
      const response = await axios.post("https://accounts.spotify.com/api/token", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: currentUrl,
          client_id: clientId,
          client_secret: secret
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const { access_token, refresh_token } = response.data;

      localStorage.setItem(TOKEN, access_token);
      localStorage.setItem(REFRESH_TOKEN, refresh_token);

      setAccessToken(access_token);

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const fetchUserData = async () => {
    if (!accessToken) return;

    naviaget("/search");
  };

  return (
    <div>
      <h1>Spotify Authorization</h1>
      {accessToken ? (
        <button onClick={fetchUserData}>Go to app</button>
      ) : (
        <p>Redirecting to Spotify for authorization...</p>
      )}
    </div>
  );
};

export default SpotifyAuthComponent;
