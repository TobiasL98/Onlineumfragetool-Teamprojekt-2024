import { IconFileDownload } from "components/icons/IconFileDownload";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import {useState} from "react";


const SaveButton = ({ className, jsonConfig }: { className: string | undefined, jsonConfig: IeFlowFile | null }) => {
    const [isHovered, setIsHovered] = useState(false);

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

    const currentFill = isHovered ?  '#7996A3' : '#FFD111';

    return (
        <button
            className={`flex justify-center pl-2 items-center cursor-pointer border-2 border-buttonBorderColor bg-buttonBackgroundColor text-buttonBorderColor hover:border-[--hover-color] hover:text-[--hover-color] ${className}`}
            type="button"
            onClick={() => {
                if (jsonConfig !== null) {
                    const formattedJsonStr = JSON.stringify(jsonConfig, null, 2); // Indentation of 2 spaces
                    const blob = new Blob([formattedJsonStr], { type: 'application/json' });

                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = jsonConfig.name + '.json';
                    link.click();

                    setTimeout(() => {
                        URL.revokeObjectURL(link.href);
                    }, 500);
                }
            }}
            disabled={jsonConfig === null} /*TODO: configfile solange null bis simulation gestartet wurde*/
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            Speichern
            <div className="p-2">
                <IconFileDownload fill={currentFill}/>
            </div>
            {/*<img src={"icons/download_file.svg"} alt={"Download File"} height={"16"} width={"16"}/>*/}
        </button>
    );
};

export default SaveButton;
