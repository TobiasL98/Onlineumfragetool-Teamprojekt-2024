import {useState} from "react";

interface IIconWalls {
    fill: string;
    hoverFill: string;
}


export const IconWalls: React.FC<IIconWalls> = ({ fill, hoverFill }) => {
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
            <path d="M6 3H4V1H3V3H1V4H3V6H4V4H6V3Z" fill={fill}/>
            <path d="M15 5V2H12V3H8V4H12V5H13V12H12V13H5V12H4V8H3V12H2V15H5V14H12V15H15V12H14V5H15ZM4 14H3V13H4V14ZM14 14H13V13H14V14ZM13 3H14V4H13V3Z" fill={fill}/>
        </svg>

    );
};
