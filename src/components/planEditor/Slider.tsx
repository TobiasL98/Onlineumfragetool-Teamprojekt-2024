import { BaseSyntheticEvent, InputHTMLAttributes, KeyboardEvent, useState } from "react";
import { useEffect, useRef } from "react";
import { Input, NumberField } from "react-aria-components";

interface ISlider extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    unit?: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    disabled?: boolean;
    onSliderChange: (e: BaseSyntheticEvent) => void;
    className?: string;
}

const Slider = ({
                    label,
                    name,
                    unit = "",
                    value,
                    min,
                    max,
                    step = 1,
                    onSliderChange,
                    disabled = false,
                    className = "",
                }: ISlider) => {
    const handleChange = (value: number) => {
        if (disabled) return; // Do not handle change if disabled
        if (isNaN(value)) {
            // If the new value is not a number or if it is outside the valid range, set the value to an empty string
            onSliderChange({ target: { name, value: 0 } } as BaseSyntheticEvent);
        } else {
            onSliderChange({ target: { name, value: value } } as BaseSyntheticEvent);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (disabled) return; // Do not handle change if disabled
    };

    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderRef.current) {
            const percent = ((value - min) / (max - min)) * 100;
            sliderRef.current.style.background = disabled
                ? "black"
                : `linear-gradient(to right, #FFE888 0%, #FFCE00 ${percent}%, #000000 ${percent}%)`;
        }
    }, [value, min, max, disabled]);

    const [isSliderActive, setIsSliderActive] = useState(false);

    return (
        <div className={`flex items-center h-8 ${className}`}>
            <div className={`w-2/6 h-full justify-start items-center text-right ${disabled ? "text-eFlow-rauchblau-dark" : "text-eFlow-rauchblau"
            }`}
            >
                <p className="text-sm">
                    {label}
                </p>
            </div>
            <div className="w-3/6">
                <input
                    ref={sliderRef}
                    name={name + "input"}
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => handleChange(parseFloat(e.target.value))}
                    step={step}
                    className={`ml-3 align-middle bg-black h-0.5 w-full rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:h-1.5 [&::-webkit-slider-thumb]:w-1.5 ${disabled ? "cursor-default [&::-webkit-slider-thumb]:bg-eFlow-rauchblau-dark" : "[&::-webkit-slider-thumb]:bg-white"
                    } ${isSliderActive ? "[&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:bg-eFlow-yellow h-1" : "[&::-webkit-slider-thumb]:h-1.5 [&::-webkit-slider-thumb]:w-1.5"
                    }`}
                    onMouseDown={() => setIsSliderActive(true)}
                    onMouseUp={() => setIsSliderActive(false)}
                    onTouchStart={() => setIsSliderActive(true)}
                    onTouchEnd={() => setIsSliderActive(false)}
                    onKeyUp={() => setIsSliderActive(true)}
                    onKeyDown={() => setIsSliderActive(true)}
                    disabled={disabled}
                />
            </div>
            <div className="w-1/6 flex h-full items-center justify-start">
                {/* <span className={`ml-5 text-center text-sm w-8 border-b-white font-dm-mono focus:text-yellow-500 focus:border-b-[#FFD111] focus:outline-none ${isSliderActive ? "text-eFlow-yellow" : disabled ? "text-eFlow-rauchblau-dark" : "text-white"
          }`}
        >
          {disabled ? "--" : value}
        </span>
        <span className={`ml-1 ${disabled ? "text-eFlow-rauchblau-dark" : "text-white"} text-[10px]`}>
          {unit}
        </span> */}
                <NumberField
                    name={`${name}-label`}
                    className="h-full"
                    isDisabled={disabled}
                    value={value}
                    onChange={handleChange}
                    aria-label={`${name}-label`}
                    formatOptions={{
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 2,
                    }}>
                    <Input
                        className={`h-full w-10 text-white text-center text-sm ml-3 border-0 border-b-[0.5px] bg-inherit focus:bg-black border-none font-dm-mono focus:border-b-[#FFD111] focus:outline-none focus:text-eFlow-yellow ${disabled ? "cursor-default border-b-black text-eFlow-rauchblau-dark" : ""}`} />
                </NumberField>
                <span className={`${disabled ? "text-eFlow-rauchblau-dark" : "text-white"} text-[10px]`}>
          {unit}
        </span>
            </div>
        </div>
    );
};

export default Slider;
