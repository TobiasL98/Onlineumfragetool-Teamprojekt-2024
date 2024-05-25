import { Group, Line, Text } from "react-konva"
import { IStage } from "../PolygonCanvas";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { getBounds } from "utils/edit/utils";

interface CanvasAxisProps {
  polygonCorners: IPolygon;
  referenceLine: IReferenceLine;
  stage: IStage;
  stageAxisOffset: number;
  parentHeight: number;
  parentWidth: number;
}

const CanvasAxis = ({ polygonCorners, referenceLine, stage, stageAxisOffset, parentHeight, parentWidth }: CanvasAxisProps) => {
  if (polygonCorners.corners.length < 2) { return }
  const { minX, maxX, minY, maxY } = getBounds(polygonCorners)
  const xMinBorder = minX * stage.scale + stage.x + stageAxisOffset
  const xMaxBorder = maxX * stage.scale + stage.x + stageAxisOffset
  const yMinBorder = minY * stage.scale + stage.y
  const yMaxBorder = maxY * stage.scale + stage.y
  let charWidth = 0
  let charHeigth = 0

  const showMarks = polygonCorners.corners.length > 1

  if (referenceLine && showMarks) {
    const lineLength = referenceLine.a.distance(referenceLine.b)
    charWidth = (referenceLine.width / lineLength) * (xMaxBorder - xMinBorder) / stage.scale
    charHeigth = (referenceLine.width / lineLength) * (yMaxBorder - yMinBorder) / stage.scale
  }


  const xAxis = <Group>
    <Line
      key={`x-axis`}
      points={[stageAxisOffset, parentHeight - stageAxisOffset, parentWidth, parentHeight - stageAxisOffset]}
      stroke="grey"
      strokeWidth={1}
    />
    <Line
      key={`x-axis-dashes`}
      points={[stageAxisOffset, parentHeight - stageAxisOffset, parentWidth, parentHeight - stageAxisOffset]}
      stroke="grey"
      strokeWidth={10}
      dashOffset={1}
      dash={[1, 50 * stage.scale]}
    />

    {showMarks &&
      <Group>
        <Line
          key={`x-axis-mark`}
          points={[Math.max(xMinBorder, stageAxisOffset), parentHeight - stageAxisOffset, xMaxBorder, parentHeight - stageAxisOffset]}
          stroke="white"
          strokeWidth={2}
        />
        <Text
          x={(xMinBorder + xMaxBorder) / 2}
          y={parentHeight - stageAxisOffset + 5}
          text={`${charWidth ? charWidth.toFixed(2) + "m" : ''}  `}
          fontSize={15}
          fill="white"
        />
        {xMinBorder > stageAxisOffset &&
          <Text
            x={xMinBorder}
            y={parentHeight - stageAxisOffset + 5}
            text={`0`}
            fontSize={15}
            fill="white"
          />
        }
      </Group>
    }
  </Group >

  const yAxis = <Group>
    <Line
      key={`axis-y`}
      points={[0 + stageAxisOffset, parentHeight - stageAxisOffset, stageAxisOffset, 0]}
      stroke="grey"
      strokeWidth={1}
    />
    <Line
      key={`axis-dashes-y`}
      points={[0 + stageAxisOffset, parentHeight - stageAxisOffset, stageAxisOffset, 0]}
      stroke="grey"
      strokeWidth={10}
      dashOffset={1}
      dash={[1, 50 * stage.scale]}
    />
    {showMarks &&
      <Group>
        <Line
          key={`y-axis-mark`}
          points={[0 + stageAxisOffset, yMinBorder, 0 + stageAxisOffset, Math.min(yMaxBorder, parentHeight - stageAxisOffset)]}
          stroke="white"
          strokeWidth={2}
        />
        {yMaxBorder < parentHeight - stageAxisOffset &&
          <Text
            x={stageAxisOffset - 25}
            y={yMaxBorder}
            text={`0`}
            fontSize={15}
            fill="white"
            rotation={-90}
          />
        }
        <Text
          x={stageAxisOffset - 25}
          y={(yMinBorder + yMaxBorder) / 2}
          rotation={-90}
          text={`${charHeigth ? charHeigth.toFixed(2) + "m" : ''}  `}
          fontSize={15}
          fill="white"
        />
      </Group>
    }
  </Group>

  return <Group>
    {xAxis}
    {yAxis}
  </Group>;
}

export default CanvasAxis