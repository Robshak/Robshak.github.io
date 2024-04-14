import { IMenuButtonProps } from "./MenuButton.props";
import styles from "./MenuButton.module.css";
import cn from "classnames";

function MenuButton({ img, children, active, className, ...props }: IMenuButtonProps) {
    return <button className={cn(
        styles["button"],
        className,
        { [styles["active"]]: active }
    )}
        {...props}>
        {img && <img className={styles["img"]} src={img} />}
        {children}
    </button >;
}

export default MenuButton;