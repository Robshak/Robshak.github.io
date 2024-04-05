import { IMenuButtonProps } from "./MenuButton.props";
import styles from "./MenuButton.module.css";
import cn from "classnames";

function MenuButton({ img, children, active, ...props }: IMenuButtonProps) {
    return <button className={cn(styles["button"], { [styles["active"]]: active })} {...props}>
        <img className={styles["img"]} src={img} alt="search icon" />
        {children}
    </button >;
}

export default MenuButton;