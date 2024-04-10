import styles from "./AddTag.module.css";
import { AddTagProps } from "./AddTag.props";
import { useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import TagItem from "../TagItem/TagItem";
import cn from "classnames";
import Popup from "reactjs-popup";

function AddTag({ tags }: AddTagProps) {
    const allTags = useSelector((s: RootState) => s.tagList);

    const getTagList = () => {
        if (!tags && !allTags) {
            return;
        }
        let have: JSX.Element[] = [];
        if (tags) {
            have = tags.map(t => {
                return <TagItem key={t.name} tag={t} status={true}></TagItem>;
            });
        }
        const havent = allTags.tags?.filter(t => !tags.find(t2 => t2.name == t.name)).map(t => {
            return <TagItem tag={t} status={false}></TagItem>;
        });
        if (havent) {
            return have.concat(havent);
        }
        return have;
    };

    return <>
        <Popup trigger={
            <button className={styles["tag-button-wrapper"]}>
                <div className={styles["tag-button"]}>
                    <div className={styles["tag-button-text"]}>
                        Add tags
                    </div>
                </div>
            </button>
        }
            position="top center"
            nested>
            <div className={cn(styles["tag-popup"])}>
                <div className={styles["header"]}>
                    Add tag
                </div>
                <div className={styles["body"]}>
                    {getTagList()}
                    <Popup trigger={<button className={styles["create-new"]}>Create new</button>} modal>
                        <div className={styles["check"]}></div>
                    </Popup>
                </div>
            </div>
        </Popup>
    </>;
}

export default AddTag;