import { useEffect, useState } from "react";
import axios from "axios";
import { TOKEN } from "../../workWithAPI/getTOKEN";

const clientId = "342af3e686ee41a9ae548be73e9b4f74";
//const redirectUri = "https://silver-bonbon-26555e.netlify.app/search/";
const redirectUri = "http://localhost:5173/search/"; // Например, 'http://localhost:3000'
const scopes = "user-read-private user-read-email"; // Scopes, которые нужны для API запросов
const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

const SpotifyAuthComponent = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Проверка наличия токена в localStorage и обработка кода из URL
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem(TOKEN);
    const codeFromUrl = new URLSearchParams(window.location.search).get("code");

    // Если токена нет, но есть код из URL (после авторизации)
    if (!tokenFromStorage && codeFromUrl) {
      // Получаем токен по коду
      getTokenFromCode(codeFromUrl);
    } 
    // Если токен отсутствует, перенаправляем на авторизацию
    else if (!tokenFromStorage) {
      window.location.href = spotifyAuthUrl;
    } else {
      // Если токен есть, используем его
      setAccessToken(tokenFromStorage);
    }
  }, []);

  // Функция для получения токена по коду
  const getTokenFromCode = async (code: string) => {
    try {
      const response = await axios.post("https://accounts.spotify.com/api/token", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: "YOUR_CLIENT_SECRET"
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const { access_token, refresh_token } = response.data;

      // Сохраняем токен в localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Устанавливаем токен для дальнейшего использования
      setAccessToken(access_token);

      // Убираем код из URL, чтобы не мешал при следующем запросе
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  // Пример использования токена для API запросов
  const fetchUserData = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div>
      <h1>Spotify Authorization</h1>
      {accessToken ? (
        <button onClick={fetchUserData}>Get User Data</button>
      ) : (
        <p>Redirecting to Spotify for authorization...</p>
      )}
    </div>
  );
};

export default SpotifyAuthComponent;
