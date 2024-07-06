import React, {forwardRef, useRef, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

import { IconTrash } from "../icons/IconTrash";
import { EditorModes } from '../../lib/edit/EditorModes';


interface FileUploadButtonProps {
    onClick: () => void;
    onFileUpload: (file: File) => void;
    onFileClear: () => void;
    uploadedFile: File | null;
    editorMode: EditorModes
}

const FileUploadButton = forwardRef<HTMLButtonElement, FileUploadButtonProps>((props, ref) => {
    const { onClick, onFileUpload, onFileClear, uploadedFile, editorMode } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    const handleClearImage = () => {
        onFileClear();
    };

    const handleClick = () => {
        if (!uploadedFile) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="relative inline-block w-full pb-1" onClick={onClick}>
            <input
                name='file'
                type="file"
                accept="*.json"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="sr-only"
                key={uploadedFile?.name}
            />
            <button ref={ref}
                    className={`border-2 border-inputBorderColor bg-inputBackgroundColor text-sm w-full rounded-none py-2 px-4 flex items-center mb-0.5  hover:border-[--hover-color] hover:text-[--hover-color] hover:bg-inputBorderColor 
        ${editorMode === EditorModes.image ? 'border-inputBackGroundColor' : ''} ${uploadedFile ? 'border-[--hover-color] bg-inputBorderColor text-[--hover-color]' : 'bg-bg-eFlow'}  `}
                onClick={handleClick}
            >
                {uploadedFile ? (
                    <>
                        <div className="flex-grow flex justify-center">
                            <span>{uploadedFile.name}</span>
                        </div>
                        <div className="ml-auto">
                            <IconTrash onClick={handleClearImage} fill={getComputedStyle(document.documentElement).getPropertyValue('--hover-color')} />
                        </div>
                    </>
                ) : (
                    <>
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        <div className="flex-grow flex justify-center">
                            <span>Eigenes Layout laden</span>
                        </div>
                    </>
                )}

            </button>
        </div>
    );
});

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
