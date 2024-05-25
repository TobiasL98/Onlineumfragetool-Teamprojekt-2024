import { ISubdomain } from 'interfaces/edit/ISubdomain';
import React from 'react';

interface ContextMenuProps {
    visible: boolean;
    x: number;
    y: number;
    subdomain: ISubdomain | null;
    onClose: () => void;
    onMenuItemClick: (itemText: string, subdomain: ISubdomain | null) => void;
    globalSelectedItems: string[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ visible, x, y, subdomain, onClose, onMenuItemClick, globalSelectedItems }) => {
    const menuItems = ['Fisch', 'Fleisch', 'Käse', 'Milch', 'Brot', 'Obst', 'Gemüse', 'Getränke', 'Alkohol', 'Pflegeartikel', 'Haushalt', 'Snacks', 'Kasse'];

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
                    {menuItems.map(item =>
                        subdomain && subdomain.selectedItems.includes(item) ?
                            <li 
                                onClick={() => onMenuItemClick(item, subdomain)}
                                className={globalSelectedItems.includes(item) ? 'selected-item' : ''}
                            >{item}</li>
                            :
                            <li
                                onClick={() => !globalSelectedItems.includes(item) && onMenuItemClick(item, subdomain)}
                                className={globalSelectedItems.includes(item) ? 'disabled' : ''}
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