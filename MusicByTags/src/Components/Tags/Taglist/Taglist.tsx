import styles from "./Taglist.module.css";
import AddTag from "../AddTag/AddTag";
import TagBlock from "../TagBlock/TagBlock";
import { TaglistProps } from "./Taglist.props";
import cn from "classnames";

function Taglist({ track, className, maxWidth }: TaglistProps) {
    return <div className={cn(styles["tags-block"], className)}>
        {track && <div className={styles["favorites-tags"]}
            style={{ maxWidth: `${maxWidth}px` }}>
            {track.tags.map((tg, index) => {
                return <TagBlock
                    key={index}
                    mini
                    tag={tg}
                    className={styles["mini-tag"]}
                    track={track}
                ></TagBlock>;
            })}
        </div>
        }
        {track ? <AddTag track={track}></AddTag> : <></>}
    </div>;
}

export default Taglist;