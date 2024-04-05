import { useNavigate } from "react-router-dom";
import MenuButton from "../../Components/MenuButton/MenuButton";
// import SearchInput from "../../Components/SearchInput/SearchInput";
import styles from "./CreatePlaylist.module.css";

function CreatePlaylist() {
    const naviaget = useNavigate();

    const changePage = () => {
        naviaget("/");
    };

    return (
        <div className={styles["page"]}>
            <div className={styles["header"]}>
                <MenuButton onClick={changePage} img="/searchIcon.svg" active={false}>Search</MenuButton>
                <MenuButton img="/playlist.svg" active={true}>Button</MenuButton>
            </div>
        </div>
    );
}

export default CreatePlaylist;
