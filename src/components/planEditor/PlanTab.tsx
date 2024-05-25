import PlanButton from "components/button/PlanButton";
import { IconDoors } from "components/icons/IconDoors";
import { IconObjectsPlan } from "components/icons/IconObjectsPlan";
import { IconWalls } from "components/icons/IconWalls";
import { EditorModes } from "lib/edit/EditorModes";

const PlanTab = ({ editorMode, onModeChange }: { editorMode: EditorModes, onModeChange: (editorMode: EditorModes) => void }) => {
    return (
        <div className="pb-3 flex flex-col text-center">
            <div>
                <PlanButton
                    label={"Wände"}
                    Component={IconWalls}
                    fill="#7996A3"
                    hoverFill="white"
                    onClick={() => onModeChange(EditorModes.walls)}
                    active={editorMode === EditorModes.walls}
                />
                <PlanButton
                    label={"Eingang"}
                    Component={IconDoors}
                    fill="#7996A3"
                    hoverFill="white"
                    onClick={() => onModeChange(EditorModes.doors)}
                    active={editorMode === EditorModes.doors}
                />
                <PlanButton
                    label={"Regale"}
                    Component={IconObjectsPlan}
                    fill="#7996A3"
                    hoverFill="white"
                    onClick={() => onModeChange(EditorModes.objects)}
                    active={editorMode === EditorModes.objects}
                />
            </div>
        </div>
    )
}

export default PlanTab
