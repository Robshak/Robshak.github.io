import { Tag } from "../../interfaces/tag.interface";
import styles from "./TagBlock.module.css";

function TagBlock({ tag }: { tag: Tag }) {

    return <div className={styles["wrapper"]} style={{ backgroundColor: tag.color }}>
        {tag.name}
    </div>;
}

export default TagBlock;