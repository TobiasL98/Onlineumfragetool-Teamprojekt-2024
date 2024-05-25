import React, { useState } from "react";

interface IPlanButton {
    label: string;
    Component: React.FC<any>; // Anpassung des Typs für die Svg-Komponente
    fill: string; // Hinzufügen von fill als Prop für die Svg-Komponente
    hoverFill: string; // Hinzufügen von hoverFill als Prop für die Svg-Komponente
    onClick: () => void;
    active?: boolean;
}

const PlanButton = ({
                        label,
                        Component, // Umbenennen der svgPath-Prop zu Component
                        fill, // Hinzufügen von fill-Prop
                        hoverFill, // Hinzufügen von hoverFill-Prop
                        onClick,
                        active,
                    }: IPlanButton) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    const SvgComponent = Component; // Umbenennen der Prop in SvgComponent

    return (
        <button
            className={
                active
                    ? "text-xs text-white font-medium w-full bg-black rounded-none py-2 px-4 flex items-center mb-0.5 border-l-[3px] border-buttonBorderColor"
                    : "text-eFlow-rauchblau text-xs w-full bg-bg-eFlow rounded-none border-0 py-2 px-4 flex items-center mb-0.5 hover:bg-eFlow-rauchblau hover:text-white hover:border-l-eFlow-rauchblau"
            }
            onClick={onClick}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <SvgComponent fill={isHovered ? hoverFill : fill} className="w-4 h-4" /> {/* Rendern der Svg-Komponente mit fill-Prop */}
            <span className="pl-6">{label}</span>
        </button>
    );
};

export default PlanButton;
