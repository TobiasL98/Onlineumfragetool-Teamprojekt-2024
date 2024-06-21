import React, { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

import { IconTrash } from "../icons/IconTrash";
import { EditorModes } from '../../lib/edit/EditorModes';

interface TypicalSupermarketButtonProps {
    onClick: () => void;
    onFileUpload: () => void;
    onFileClear: () => void;
    editorMode: EditorModes
}

const TypicalSupermarketButton: React.FC<TypicalSupermarketButtonProps> = ({ onClick, onFileUpload, onFileClear, editorMode }) => {
    const [isClicked, setIsClicked] = useState(false); // New state variable
    
    const handleClearImage = () => {
        onFileClear();
    };

    const handleClick = () => {
        onFileUpload();
        setIsClicked(true); 
    };

    return (
        <div className="relative inline-block w-full pb-1" onClick={onClick}>
            <button
                className={`border-2 border-inputBorderColor bg-inputBackgroundColor text-sm w-full rounded-none py-2 px-4 flex items-center mb-0.5  hover:border-[--hover-color] hover:text-[--hover-color] hover:bg-inputBorderColor
        ${editorMode === EditorModes.image ? 'border-inputBackGroundColor' : ''} ${isClicked ? 'border-[--hover-color] bg-inputBorderColor text-[--hover-color]' : 'bg-bg-eFlow'}  `}
                onClick={handleClick}
            >
                {isClicked ? (
                    <>
                        <div className="flex-grow flex justify-center">
                            <span>{"Typischer Supermarkt"}</span>
                        </div>
                        <div className="ml-auto">
                            <IconTrash onClick={handleClearImage} fill={getComputedStyle(document.documentElement).getPropertyValue('--hover-color')} />
                        </div>
                    </>
                ) : (
                    <>
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <div className="flex-grow flex justify-center">
                            <span>Typische Vorlage laden</span>
                        </div>
                    </>
                )}

            </button>
        </div>
    );
};

export default TypicalSupermarketButton;