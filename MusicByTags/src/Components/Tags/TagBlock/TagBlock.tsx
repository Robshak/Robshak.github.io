import styles from "./TagBlock.module.css";
import cn from "classnames";
import { TagBlockProps } from "./TagBlock.props";

function TagBlock({ tag, className, ...props }: TagBlockProps) {

    return <div className={styles["wrapper"]} {...props}>
        <div className={cn(styles["tag"], className)} style={{ backgroundColor: tag.color }}>
            <div className={styles["tag-text"]}>{tag.name}</div>
        </div>
    </div>;
}

export default TagBlock;