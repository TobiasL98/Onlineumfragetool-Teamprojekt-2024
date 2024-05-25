
export const fitToFormat = (clientWidth: number, clientHeight: number, stageAxisOffset: number, bounds: { maxX: number, minX: number, maxY: number, minY: number }) => {
  const buffer = 100 + stageAxisOffset

  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY

  const scale = Math.min(clientWidth / (width + buffer), clientHeight / (height + 2 * buffer))

  const stage = {
    scale: scale,
    x: (- bounds.minX + buffer / 2) * scale,
    y: (- bounds.minY + buffer / 2) * scale,
  };

  return stage
}


export const calculateTextOffset = (rotation: number, scale: number) => {
  const angleInRadians = rotation * Math.PI / 180;
  const offset = 10 / scale;
  return {
    x: offset * Math.cos(angleInRadians),
    y: offset * Math.sin(angleInRadians)
  };
};