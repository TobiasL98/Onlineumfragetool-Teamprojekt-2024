import PlanButton from "components/button/PlanButton";
import SaveButton from "components/button/SaveButton";
import { IconDoors } from "components/icons/IconDoors";
import { IconObjectsPlan } from "components/icons/IconObjectsPlan";
import { IconWalls } from "components/icons/IconWalls";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import { EditorModes } from "lib/edit/EditorModes";

const PlanTab = ({configFile, editorMode, onModeChange }: { configFile: IeFlowFile, editorMode: EditorModes, onModeChange: (editorMode: EditorModes) => void }) => {
    return (
        <div className=" flex flex-col h-full justify-between text-center">
            <div className="pb-8">
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
                    onClick={() => onModeChange(EditorModes.shelfs)}
                    active={editorMode === EditorModes.shelfs}
                />
                <PlanButton
                    label={"Kassen"}
                    Component={IconObjectsPlan} // TO DO: Different Icon
                    fill="#7996A3"
                    hoverFill="white"
                    onClick={() => onModeChange(EditorModes.checkouts)}
                    active={editorMode === EditorModes.checkouts}
                />
            </div>
            <div id="erklärung" className={"px-4 border-t-2 border-black flex-grow"}>
                <div className="w-full flex flex-row  mt-3 mb-1">
                    {editorMode === EditorModes.walls && (
                        <p className={"text-white text-[13px] font-bold"}>Wände</p>
                    )}
                    {editorMode === EditorModes.doors && (
                        <p className={"text-white text-[13px] font-bold"}>Eingang</p>
                    )}
                    {editorMode === EditorModes.shelfs && (
                        <p className={"text-white text-[13px] font-bold"}>Regale</p>
                    )}
                    {editorMode === EditorModes.checkouts && (
                        <p className={"text-white text-[13px] font-bold"}>Kassen</p>
                    )}
                </div>
                <div className="pb-3">
                    <div>
                        {editorMode === EditorModes.walls && (
                            <p className={"text-white text-[11px]"}>
                                In der Simulation dienen die Wände als äußere Begrenzung der Fläche, auf der sich die Personen bewegen sollen. Eingestellte Eckpunkte können mit der rechten Maustaste gelöscht werden. Die Außenwände müssen eine geschlossene Fläche bilden. Nur wenn eine geschlossene Fläche mit einem Ausgang vorhanden ist, kann eine Simulation durchgeführt werden.
                            </p>
                        )}
                        {editorMode === EditorModes.doors && (
                            <p className={"text-white text-[11px]"}>
                                Die Personen betreten die Simulation durch Türen. Türen können mit der rechten Maustaste wieder gelöscht werden.
                            </p>
                        )}
                        {editorMode === EditorModes.shelfs && (
                            <p className={"text-white text-[11px]"}>
                                Regale sind Teile innerhalb eines Plans, die zur Aufbewahrung und Organisation von Produkten dienen. Eingestellte Regale können mit der linken Maustaste einem Bereich zugeordnet werden. Jedes Regal muss einem Bereich zugeordnet werden und jeder Bereich kann auch nur einmalig ausgewählt werden.
                                Eingestellte Eckpunkte können mit der rechten Maustaste gelöscht werden.
                            </p>
                        )}
                        {editorMode === EditorModes.checkouts && (
                            <p className={"text-white text-[11px]"}>
                                Kassen stellen in der Simulation den Ausgang, also den letzten Punkt dar, welcher eine Person besucht.
                                Kassen können mit der rechten Maustaste gelöscht werden.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanTab
