import { IShelf } from 'interfaces/edit/IShelf';
import { EditorModes } from 'lib/edit/EditorModes';
import React from 'react';

interface ContextMenuProps {
    mode: EditorModes;
    visible: boolean;
    x: number;
    y: number;
    shelf: IShelf | null;
    onClose: () => void;
    onMenuItemClick: (itemText: string, shelf: IShelf | null) => void;
    globalSelectedItems?: string[];
    globalSelectedShoppingTimes?: string[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ mode, visible, x, y, shelf, onClose, onMenuItemClick, globalSelectedItems, globalSelectedShoppingTimes }) => {
    const menuItems = ['Fisch (Theke)', 'Fleisch (Theke)', 'Käse (Theke)',
        'Käse', 'Milchprodukte', 'Milch',  'Wurst', 'Brot (Theke)', 'Obst', 'Gemüse', 'Getränke', 'Getränke (gekühlt)',
        'Alkohol', 'Pflegeartikel', 'Haushalt', 'Snacks (salzig)', 'Snacks (süß)', 'Tiefkühler (Fleisch/Fisch)'
        , 'Tiefkühler (Obst/Gemüse)', 'Tiefkühler (Fertiggerichte)', 'Tiefkühler (Eis)', 'Tiefkühler (Pizza)', 'Tiefkühler (Brot/Gebäck)',
        'Tiefkühler (Kuchen)', 'Konserven', 'Nudeln/Reis', 'Fertigprodukte/Soßen'
    ];

    const shoppingTimes = ['kurz', 'mittel', 'lang'];

    if (!visible) {
        return null;
    }
    
    return (
        <>
            <style>
                {`
                    .context-menu {
                        position: absolute;
                        top: ${y}px;
                        left: ${x}px;
                        background-color: var(--header-color);
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        color: var(--inputBorderColor);
                        fontSize: '80%',
                        z-index: 1000;
                    }
                     .context-menu ul li {
                        border: 1px solid rgba(var(--inputBorderColor), 1);
                        borderBottom: 1px solid rgba(var(--inputBorderColor), 1);
                        padding: 0.5rem;
                
                    }
                    .context-menu ul li:hover {
                        background-color: rgba(var(--dropdown-hover-color), 0.2);
                        color: white;
                    }
                    .context-menu ul li:active, .selected-item {
                        background-color: rgba(var(--dropdown-hover-color), 1);
                        color: white;
                    }
                    .disabled {
                        color: #808080; 
                        pointer-events: none; 
                    }
                `}
            </style>
            <div className="context-menu" onClick={onClose}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    { mode == EditorModes.image  && shelf && shoppingTimes.map(item =>
                            <li
                                onClick={() => onMenuItemClick(item, shelf)}
                                className={ shelf.shoppingTime === item ? 'selected-item' : ''}
                            >{item}</li>
                )}
                    {mode === EditorModes.shelfs && menuItems.map(item =>
                        shelf && shelf.selectedItems.includes(item) ?
                            <li
                                onClick={() => onMenuItemClick(item, shelf)}
                                className={globalSelectedItems?.includes(item) ? 'selected-item' : ''}
                            >{item}</li>
                            :
                            <li
                                onClick={() => !globalSelectedItems?.includes(item) && onMenuItemClick(item, shelf)}
                                className={globalSelectedItems?.includes(item) ? 'disabled' : ''}
                            >
                                {item}
                            </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default ContextMenu;