import { Tag } from "../../interfaces/tag.interface";
import TagBlock from "../TagBlock/TagBlock";
import styles from "./TagItem.module.css";
import cn from "classnames";

function TagItem({ tag, status }: { tag: Tag, status: boolean }) {
    // FIX подключиться ко всем тегам, подключиться к песне, которую нажали,
    // к её тегам и отобразить сначала добавленные, потом остольные, но без повторов

    return <div className={styles["wrapper"]}>
        <TagBlock tag={tag}></TagBlock>
        <div className={cn(styles["tag-status"], {
            [styles["added-tag"]]: status
        })}></div>
    </div>;
}

export default TagItem;