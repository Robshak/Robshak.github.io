import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./TotalSearch.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { FormEvent } from "react";
import TrackList from "../../Components/Tracks/TrackList/TrackList";
import { getTOKEN } from "../../workWithAPI/getTOKEN";
import { Track } from "../../interfaces/Track.interface";
import { AxiosError } from "axios";
import { searchAPI } from "../../workWithAPI/searchAPI";
import { PlayerActions } from "../../Store/CurrentTrackStateSlices/playerManager.slice";

function TotalSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const naviaget = useNavigate();
    const { searchtList, currentList } = useSelector((s: RootState) => s.player);

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
        dispatch(PlayerActions.setSearchList(data as Track[]));
    };

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
                    autoFocus onChange={onSearch}></SearchInput>
                <MenuButton onClick={changePage} img="/playlist.svg" active={false}>Create playlist</MenuButton>
            </div>
            <TrackList list={searchtList} changerList={changeList} head={<></>}></TrackList>
        </div>
    );
}

export default TotalSearch;
