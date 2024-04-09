import styles from "./AddTag.module.css";
import cn from "classnames";
import { AddTagProps } from "./AddTag.props";

function AddTag({ tags, trackId }: AddTagProps) {
    return <>
        <div className={styles["tag-button-wrapper"]}>
            <div className={styles["tag-button"]}>
                <div className={styles["tag-button-text"]}>
                    Add tags
                </div>
            </div>
        </div>
    </>;
}

export default AddTag;