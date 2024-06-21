export const IconTrash = ({ fill, onClick }: { fill: string; onClick: () => void }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
            <path d="M7 6H6V12H7V6Z" fill={fill} />
            <path d="M10 6H9V12H10V6Z" fill={fill} />
            <path d="M2 3V4H3V14C3 14.55 3.45 15 4 15H12C12.55 15 13 14.55 13 14V4H14V3H2ZM4 14V4H12V14H4Z" fill={fill} />
            <path d="M10 1H6V2H10V1Z" fill={fill} />
        </svg>
    );
};
