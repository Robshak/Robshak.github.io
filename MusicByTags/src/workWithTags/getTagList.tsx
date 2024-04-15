import TagItem from "../Components/Tags/TagItem/TagItem";
import { Track } from "../interfaces/Track.interface";
import { Tag } from "../interfaces/tag.interface";

// A function that takes all existing tags and those that exist on the given track.
// Returns tags in the desired order, prioritizing tags that exist on the track.
export const getTagList = (allTags: Tag[], favorites: Tag[], track?: Track) => {
    if (!allTags) {
        return;
    }

    // First, get the favorite tags
    const tags = favorites;
    let have: JSX.Element[] = [];
    if (tags) {
        have = tags.map(tg => {
            return <TagItem key={tg.name} tag={tg} status={true} track={track}></TagItem>;
        });
    }

    // Then get all the others, excluding those already added
    const havent = allTags
        .filter(tg => {
            if (tags) {
                return !tags.find(tg2 => tg2.name == tg.name);
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
