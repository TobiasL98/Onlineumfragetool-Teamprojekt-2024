'use client';

import { useState } from 'react';
import { IconFileDownload } from 'components/icons/IconFileDownload';
import { IeFlowFile } from 'interfaces/edit/IeFlowFile';

const SaveButton = ({ className, jsonConfig }: { className: string | undefined, jsonConfig: IeFlowFile | null }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveConfig = async (newConfig: IeFlowFile) => {
        try {
            const response = await fetch('/api/saveConfig', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newConfig })
            });

            if (!response.ok) {
                throw new Error('Failed to save config');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            setError('Failed to save config');
        }
    };

    const handleMouseOver = () => {
        if (!jsonConfig) {
            return;
        }
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        if (!jsonConfig) {
            return;
        }
        setIsHovered(false);
    };

    const currentFill = isHovered ? '#7996A3' : '#FFD111';

    return (
        <button
            className={`flex justify-center pl-2 items-center cursor-pointer border-2 border-buttonBorderColor bg-buttonBackgroundColor text-buttonBorderColor hover:border-[--hover-color] hover:text-[--hover-color] ${className}`}
            type="button"
            onClick={() => {
                if (jsonConfig !== null) {
                    const formattedJsonStr = JSON.stringify(jsonConfig, null, 2)
                    const blob = new Blob([formattedJsonStr], { type: 'application/json' });

                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = jsonConfig.name + '.json';
                    link.click();

                    handleSaveConfig(jsonConfig);

                    setTimeout(() => {
                        URL.revokeObjectURL(link.href);
                    }, 500);
                }
            }}
            disabled={jsonConfig === null}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            Speichern
            <div className="p-2">
                <IconFileDownload fill={currentFill} />
            </div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </button>
    );
};

export default SaveButton;
