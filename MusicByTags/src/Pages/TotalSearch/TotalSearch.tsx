import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./TotalSearch.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store/store";
import { getTracks, playlistActions } from "../../Store/playlist.slice";
import { FormEvent } from "react";
import TrackList from "../../Components/TrackList/TrackList";
import { getTOKEN } from "../../workWithAPI/getTOKEN";

function TotalSearch() {
    const dispatch = useDispatch<AppDispatch>();
    const naviaget = useNavigate();

    getTOKEN();

    const changePage = () => {
        dispatch(playlistActions.clearState());
        naviaget("/playlist");
    };

    const onSearch = async (e: FormEvent<HTMLInputElement>) => {
        dispatch(getTracks({ searchString: e.currentTarget.value }));
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <SearchInput img="/searchIcon.svg" id="search" type="text"
                    placeholder="Search by song or author" autoComplete="off"
                    autoFocus onChange={onSearch}></SearchInput>
                <MenuButton onClick={changePage} img="/playlist.svg" active={false}>Button</MenuButton>
            </div>
            <TrackList></TrackList>
        </div>
    );
}

export default TotalSearch;
