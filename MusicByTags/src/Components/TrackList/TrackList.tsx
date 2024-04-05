import { useSelector } from "react-redux";
import styles from "./TrackList.module.css";
import { RootState } from "../../Store/store";
import { getTracksById } from "../../workWithAPI/getTracks";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import { Track } from "../../interfaces/Track.interface";
import TrackItem from "../Track/Track";

function TrackList() {
    const { tracks } = useSelector((s: RootState) => s.playlist);
    const { data } = useLoaderData() as { data: Track[] };

    if (tracks) {
        console.log(getTracksById(tracks));
    }

    return <div className={styles["track-list"]}>
        <Suspense fallback={<>Loading</>}>
            <Await resolve={data}>
                {({ data }: { data: Track[] }) => (
                    data.map(track => <TrackItem params={track} number={0}></TrackItem>)
                )}
            </Await>
        </Suspense>
    </div>;
}

export default TrackList;