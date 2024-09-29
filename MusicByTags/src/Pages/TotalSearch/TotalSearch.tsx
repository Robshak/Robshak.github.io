import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./TotalSearch.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { useEffect, useRef, useState } from "react";
import TrackList from "../../Components/Tracks/TrackList/TrackList";
import { Track } from "../../interfaces/Track.interface";
import { AxiosError } from "axios";
import { searchAPI } from "../../workWithAPI/searchAPI";
import { PlayerActions } from "../../Store/CurrentTrackStateSlices/playerManager.slice";

// object - current search list
function TotalSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const naviaget = useNavigate();
    const [query, setQuery] = useState("");
    const [delayedQuery, setDelayedQuery] = useState("");
    const timerIdRef = useRef<number | null>(null);
    const { searchtList, currentList } = useSelector((s: RootState) => s.player);

    // go to page "create playlist"
    const changePage = () => {
        naviaget("/playlist");
    };

    // get tracks from API
    const createSearch = async (params: { searchString: string }) => {
        try {
            const data: (Track | undefined)[] | undefined = await searchAPI(params.searchString);
            if (data) {
                data?.filter(track => track != undefined);
            }
            return data;
        } catch (e) {
            if (e instanceof AxiosError) {
                throw new Error(e.response?.data.message);
            }
        }
    };

    // Performing a search when the query changes
    const runSearch = async (searchQuery: string) => {
        let data = await createSearch({ searchString: searchQuery });
        if (!data) {
            return;
        }
        data = data.filter(tr => tr);
        dispatch(PlayerActions.setSearchList(data as Track[]));
    };

    const onSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (timerIdRef.current) {
          clearTimeout(timerIdRef.current);
        }

        timerIdRef.current = window.setTimeout(() => {
            setDelayedQuery(newQuery);
        }, 500);
    };

    useEffect(() => {
        if (delayedQuery) {
          runSearch(delayedQuery);
        }
    }, [delayedQuery]);

    // update function for drag-and-drop
    const changeList = (newValue: Track[]) => {
        if (currentList == searchtList) {
            dispatch(PlayerActions.setCurrentList(newValue));
        }
        dispatch(PlayerActions.setSearchList(newValue));
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <SearchInput img="/searchIcon.svg" id="search" type="text"
                    placeholder="Search by song or author" autoComplete="off"
                    autoFocus value={query} onChange={onSearch}></SearchInput>
                <MenuButton onClick={changePage} img="/playlist.svg" active={false}>Create playlist</MenuButton>
            </div>
            <TrackList list={searchtList} changerList={changeList} head={<></>}></TrackList>
        </div>
    );
}

export default TotalSearch;
