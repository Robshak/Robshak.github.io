import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import TotalSearch from "./Pages/TotalSearch/TotalSearch";
import CreatePlaylist from "./Pages/CreatePlaylist/CreatePlaylist";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import Player from "./Layout/Player/Player";

const router = createBrowserRouter([
  {
    path: "",
    element: <Player></Player>,
    children: [
      {
        path: "/",
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
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
