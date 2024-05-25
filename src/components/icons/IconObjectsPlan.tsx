import {useState} from "react";

interface IIconObjectsPlan {
    fill: string;
    hoverFill: string;
}


export const IconObjectsPlan: React.FC<IIconObjectsPlan> = ({ fill, hoverFill }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const currentFill = isHovered ? hoverFill : fill;

    return (
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 11H3C2.45 11 2 10.55 2 10V3C2 2.45 2.45 2 3 2H7C7.55 2 8 2.45 8 3V10C8 10.55 7.55 11 7 11ZM3 3V10H7V3H3Z" fill={fill}/>
            <path d="M13 10V13H10V10H13ZM13 9H10C9.45 9 9 9.45 9 10V13C9 13.55 9.45 14 10 14H13C13.55 14 14 13.55 14 13V10C14 9.445 13.55 9 13 9Z" fill={fill}/>
            <path d="M11.96 5V7H9.95996V5H11.96ZM11.96 4H9.95996C9.40996 4 8.95996 4.45 8.95996 5V7C8.95996 7.55 9.40996 8 9.95996 8H11.96C12.51 8 12.96 7.55 12.96 7V5C12.96 4.45 12.51 4 11.96 4Z" fill={fill}/>
        </svg>

    );
};
