import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./TotalSearch.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { FormEvent } from "react";
import TrackList from "../../Components/Tracks/TrackList/TrackList";
import { getTOKEN } from "../../workWithAPI/getTOKEN";
import { Track } from "../../interfaces/Track.interface";
import { AxiosError } from "axios";
import { searchAPI } from "../../workWithAPI/searchAPI";
import { List } from "../../interfaces/list.interface";
import { PlayerActions } from "../../Store/CurrentTrackStateSlices/playerManager.slice";

function TotalSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const naviaget = useNavigate();
    // const { tracks } = useSelector((s: RootState) => s.taglistOnTrack);

    getTOKEN();

    const changePage = () => {
        naviaget("/playlist");
    };

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

    const onSearch = async (e: FormEvent<HTMLInputElement>) => {
        const data = await createSearch({ searchString: e.currentTarget.value });
        if (!data) {
            return;
        }
        const list: List = {
            tracks: data as Track[],
            tags: []
        };
        list.tracks = list.tracks.filter(t => t);
        dispatch(PlayerActions.pushList(list));
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <SearchInput img="/searchIcon.svg" id="search" type="text"
                    placeholder="Search by song or author" autoComplete="off"
                    autoFocus onChange={onSearch}></SearchInput>
                <MenuButton onClick={changePage} img="/playlist.svg" active={false}>Create playlist</MenuButton>
            </div>
            <TrackList tags={[]} head={<></>}></TrackList>
        </div>
    );
}

export default TotalSearch;
