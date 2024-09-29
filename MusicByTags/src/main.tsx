import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import TotalSearch from "./Pages/TotalSearch/TotalSearch";
import CreatePlaylist from "./Pages/CreatePlaylist/CreatePlaylist";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import Player from "./Layout/Player/Player";
import { ContextMenuProvider } from "./Components/Context/Contextmenu/Contextmenu.provider";
import SpotifyAuthComponent from "./Pages/SpotifyAuth/SpotifyAuth";

// Create router
const router = createBrowserRouter([
  {
    path: "",
    element: <Player></Player>,
    children: [
      {
        path: "/",
        element: <SpotifyAuthComponent></SpotifyAuthComponent>
      },
      {
        path: "/search",
        element: <TotalSearch></TotalSearch>
      },
      {
        path: "/playlist",
        element: <CreatePlaylist></CreatePlaylist>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextMenuProvider>
        <RouterProvider router={router}></RouterProvider>
      </ContextMenuProvider>
    </Provider>
  </React.StrictMode>
);
