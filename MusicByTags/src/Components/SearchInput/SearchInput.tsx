import { ISearchInputProps } from "./SearchInput.props";
import styles from "./SearchInput.module.css";

// Object - search input for menu
function SearchInput({ img, ...props }: ISearchInputProps) {
    return <div className={styles["input-box"]}>
        <label className={styles["label"]} htmlFor={props.id}>
            <img src={img} alt="search icon" />
        </label>
        <input className={styles["input"]} {...props} />
    </div>;
}

export default SearchInput;