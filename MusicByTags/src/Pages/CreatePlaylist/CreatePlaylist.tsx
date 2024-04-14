import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
// import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./CreatePlaylist.module.css";
import TrackList from "../../Components/Tracks/TrackList/TrackList";
import CreateTaglistPanel from "../../Components/Tags/CreateTaglistPanel/CreateTaglistPanel";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import { PlayerActions } from "../../Store/CurrentTrackStateSlices/playerManager.slice";
import { Track } from "../../interfaces/Track.interface";

function CreatePlaylist() {
    const dispatch = useDispatch<AppDispatch>();
    const naviaget = useNavigate();
    const { createList, currentList } = useSelector((s: RootState) => s.player);

    const changePage = () => {
        naviaget("/");
    };

    const changeList = (newValue: Track[]) => {
        if (currentList == createList) {
            dispatch(PlayerActions.setCurrentList(newValue));
        }
        dispatch(PlayerActions.setCreateList(newValue));
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <MenuButton onClick={changePage} img="/searchIcon.svg" active={false}>Search</MenuButton>
                <MenuButton img="/playlist.svg" active={true}>Create playlist</MenuButton>
            </div>
            <TrackList
                list={createList}
                changerList={changeList}
                head={<CreateTaglistPanel></CreateTaglistPanel>}
            >
            </TrackList>
        </div>
    );
}

export default CreatePlaylist;
