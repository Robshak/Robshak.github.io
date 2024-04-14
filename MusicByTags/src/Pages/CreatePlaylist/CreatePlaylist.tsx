import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
// import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./CreatePlaylist.module.css";
import TrackList from "../../Components/Tracks/TrackList/TrackList";
import CreateTaglistPanel from "../../Components/Tags/CreateTaglistPanel/CreateTaglistPanel";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";

function CreatePlaylist() {
    const naviaget = useNavigate();
    const { dynamicTags } = useSelector((s: RootState) => s.currentDynamicTags);

    const changePage = () => {
        naviaget("/");
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <MenuButton onClick={changePage} img="/searchIcon.svg" active={false}>Search</MenuButton>
                <MenuButton img="/playlist.svg" active={true}>Create playlist</MenuButton>
            </div>
            <TrackList tags={dynamicTags}
                head={<CreateTaglistPanel></CreateTaglistPanel>}
            >
            </TrackList>
        </div>
    );
}

export default CreatePlaylist;
