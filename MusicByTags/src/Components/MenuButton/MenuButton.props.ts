import { ButtonHTMLAttributes, ReactNode } from "react";

export interface IMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    img?: string;
    children: ReactNode;
    active: boolean;
    className?: string;
}