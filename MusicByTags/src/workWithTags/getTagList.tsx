import TagItem from "../Components/Tags/TagItem/TagItem";
import { Tag } from "../interfaces/tag.interface";

export const getTagList = (allTags: Tag[], favorites: Tag[]) => {
    if (!allTags) {
        return;
    }
    const tags = favorites;
    let have: JSX.Element[] = [];
    if (tags) {
        have = tags.map(t => {
            return <TagItem key={t.name} tag={t} status={true}></TagItem>;
        });
    }
    const havent = allTags
        .filter(t => {
            if (tags) {
                return !tags.find(t2 => t2.name == t.name);
            }
            return true;
        })
        .map(t => {
            return <TagItem key={t.name} tag={t} status={false}></TagItem>;
        });
    if (havent) {
        return have.concat(havent);
    }
    return have;
};
