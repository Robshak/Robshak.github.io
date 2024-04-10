import { Tag } from "../../interfaces/tag.interface";
import styles from "./TagBlock.module.css";
import cn from "classnames";

function TagBlock({ tag, className }: { tag: Tag, className?: string }) {

    return <div className={styles["wrapper"]}>
        <div className={cn(styles["tag"], className)} style={{ backgroundColor: tag.color }}>
            <div className={styles["tag-text"]}>{tag.name}</div>
        </div>
    </div>;
}

export default TagBlock;