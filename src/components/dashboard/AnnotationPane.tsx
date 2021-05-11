import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Ellipse, Arrow } from 'react-konva';
import ResizeObserver from 'resize-observer-polyfill';

const AnnotationPane: React.FC<{
  params: { tool: string; color: string };
  data: any;
  WIDTH: number;
  HEIGHT: number;

  editable: boolean;
  onChange: any;
  onChangeStart: any;
  onChangeEnd: any;
}> = ({
  params: { tool, color },
  data,
  WIDTH,
  HEIGHT,
  editable,
  onChange,
  onChangeStart,
  onChangeEnd,
}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [proportion, setProportion] = useState(0);

  const lines = data.lines;
  const arrows = data.arrows;
  const rects = data.rects;
  const ellipses = data.ellipses;

  const strokeWidth = 3;
  const isDrawing = useRef(false);
  const panelContainerRef = useRef<HTMLDivElement>();

  let handleMouseDown: any = () => false;
  let handleMouseMove: any = () => false;
  let handleMouseUp: any = () => false;

  if (editable) {
    handleMouseDown = (e) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      pos.x = pos.x * (1 / proportion);
      pos.y = pos.y * (1 / proportion);

      if (tool === 'pen' || tool === 'line') {
        const newLines = [...lines, { color, points: [pos.x, pos.y] }];

        onChangeStart({
          ...data,
          lines: newLines,
        });
      }

      if (tool === 'rectangle') {
        const newRects = [
          ...rects,
          {
            color,
            originX: pos.x,
            originY: pos.y,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
          },
        ];

        onChangeStart({
          ...data,
          rects: newRects,
        });
      }

      if (tool === 'ellipse') {
        const newEllipses = [
          ...ellipses,
          {
            color,
            originX: pos.x,
            originY: pos.y,
            x: pos.x,
            y: pos.y,
            radiusX: 0,
            radiusY: 0,
          },
        ];

        onChangeStart({
          ...data,
          ellipses: newEllipses,
        });
      }

      if (tool === 'arrow') {
        const newArrows = [...arrows, { color, points: [pos.x, pos.y] }];

        onChangeStart({
          ...data,
          arrows: newArrows,
        });
      }
    };

    handleMouseMove = (e) => {
      if (!isDrawing.current) {
        return;
      }
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      point.x = point.x * (1 / proportion);
      point.y = point.y * (1 / proportion);

      if (tool === 'pen' || tool === 'line') {
        const lastLine = lines[lines.length - 1];

        if (tool === 'line') {
          lastLine.points = [
            lastLine.points[0],
            lastLine.points[1],
            point.x,
            point.y,
          ];
        } else {
          lastLine.points = lastLine.points.concat([point.x, point.y]);
        }

        lines.splice(lines.length - 1, 1, lastLine);

        onChange({
          ...data,
          lines: lines.concat(),
        });
      }

      if (tool === 'rectangle') {
        const lastRect = rects[rects.length - 1];
        let x = lastRect.x;
        let y = lastRect.y;
        let width = point.x - lastRect.originX;
        let height = point.y - lastRect.originY;

        if (width < 0) x = point.x;
        if (height < 0) y = point.y;

        width = Math.abs(width);
        height = Math.abs(height);

        lastRect.x = x;
        lastRect.y = y;
        lastRect.width = width;
        lastRect.height = height;

        rects.splice(rects.length - 1, 1, lastRect);

        onChange({
          ...data,
          rects: rects.concat(),
        });
      }

      if (tool === 'ellipse') {
        const lastEllipse = ellipses[ellipses.length - 1];
        let radiusX = (point.x - lastEllipse.originX) / 2;
        let radiusY = (point.y - lastEllipse.originY) / 2;
        let x = lastEllipse.originX + radiusX;
        let y = lastEllipse.originY + radiusY;

        radiusX = Math.abs(radiusX);
        radiusY = Math.abs(radiusY);

        if (radiusX < 0) x = point.x + radiusX;
        if (radiusY < 0) y = point.y + radiusY;

        lastEllipse.x = x;
        lastEllipse.y = y;
        lastEllipse.radiusX = radiusX;
        lastEllipse.radiusY = radiusY;

        ellipses.splice(ellipses.length - 1, 1, lastEllipse);

        onChange({
          ...data,
          ellipses: ellipses.concat(),
        });
      }

      if (tool === 'arrow') {
        const lastArrow = arrows[arrows.length - 1];
        lastArrow.points = [
          lastArrow.points[0],
          lastArrow.points[1],
          point.x,
          point.y,
        ];
        arrows.splice(arrows.length - 1, 1, lastArrow);

        onChange({
          ...data,
          arrows: arrows.concat(),
        });
      }
    };

    handleMouseUp = () => {
      isDrawing.current = false;
      onChangeEnd();
    };
  }

  useEffect(() => {
    const unsubscribe = new ResizeObserver(() => {
      if (panelContainerRef.current) {
        setWidth(panelContainerRef.current.clientWidth);
        setHeight(panelContainerRef.current.clientHeight);
      }
    }).observe(panelContainerRef.current);

    return () => unsubscribe;
  }, []);

  useEffect(() => {
    setProportion(width / WIDTH);
  }, [width]);

  return (
    <div
      className={`
        absolute left-0 top-0 w-full h-full overflow-hidden
        ${tool === 'move' ? 'cursor-default' : ''}
        ${tool === 'eraser' ? 'cursor-pointer' : ''}
        ${editable ? 'cursor-crosshair' : 'default'}
      `}
      ref={panelContainerRef}
    >
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer style={{ background: 'red' }}>
          {lines.map((line, key) => (
            <Line
              key={key}
              points={line.points.map((point) => point * proportion)}
              stroke={line.color}
              strokeWidth={strokeWidth}
              tension={0}
              bezier
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}

          {rects.map((rect, key) => (
            <Rect
              key={key}
              x={rect.x * proportion}
              y={rect.y * proportion}
              width={rect.width * proportion}
              height={rect.height * proportion}
              stroke={rect.color}
              strokeWidth={strokeWidth}
              cornerRadius={8}
            />
          ))}

          {ellipses.map((ellipse, key) => (
            <Ellipse
              key={key}
              x={ellipse.x * proportion}
              y={ellipse.y * proportion}
              radiusX={ellipse.radiusX * proportion}
              radiusY={ellipse.radiusY * proportion}
              stroke={ellipse.color}
              strokeWidth={strokeWidth}
            />
          ))}

          {arrows.map((arrow, key) => (
            <Arrow
              key={key}
              points={arrow.points.map((point) => point * proportion)}
              pointerLength={20}
              pointerWidth={20}
              stroke={arrow.color}
              fill={arrow.color}
              strokeWidth={strokeWidth}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default AnnotationPane;
