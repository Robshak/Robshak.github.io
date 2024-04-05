import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, defer } from "react-router-dom";
import TotalSearch from "./Pages/TotalSearch/TotalSearch";
import CreatePlaylist from "./Pages/CreatePlaylist/CreatePlaylist";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./Store/store";
import { getTracksById } from "./workWithAPI/getTracks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TotalSearch></TotalSearch>,
    loader: async () => {
      return defer({
        data: new Promise((resolve, reject) => {
          const { tracks } = useSelector((s: RootState) => s.playlist);
          if (tracks) {
            getTracksById(tracks).then(data => resolve(data)).catch(e => reject(e));
          }
        })
      });
    }
  },
  {
    path: "/playlist",
    element: <CreatePlaylist></CreatePlaylist>
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
