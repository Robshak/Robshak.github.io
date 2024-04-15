import { Tag } from "../../../interfaces/tag.interface";

export interface DynamicTagPopupProps {
    dynamicTagId: number;
    favoriteTags: Tag[];
    onClose: () => void;
}