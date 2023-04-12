import React, { useRef, useEffect } from "react";

import calculateBoard from "./board";
import { Draw } from "./drawings";

export type Scale = "WEEKS" | "MONTHS" | "YEARS";

export type Interval = {
  A: Date;
  B: Date;
  color: string;
  title: string;
};
export type Point = {
  x: number;
  y: number;
};
export type Size = {
  dx: number;
  dy: number;
};
export type UnitInterval = {
  A: number;
  B: number;
  from: number;
  to: number;
  color: string;
  title: string;
};

export type LifeProps = {
  startDate: Date;
  yearsToShow: number;
  scale: Scale;
  intervals?: Array<Interval>;
  canvasSizePx: Size;
  strokeColor: string;
  style?: React.CSSProperties;
  draw: Draw;
};

export default function LifeBoard({ startDate, yearsToShow, scale, intervals, canvasSizePx, style, strokeColor, draw }: LifeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    const board = calculateBoard(startDate, yearsToShow, scale, canvasSizePx);
    const unitIntervals = intervals ? board.intervalToUnits(intervals) : [];

    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d");
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      const ctx: CanvasRenderingContext2D | null = ctxRef.current;
      //
      if (ctx) {
        // init ==============================
        draw.initCanvas(canvas, ctx, board, canvasSizePx, strokeColor);

        let requestId: number;
        let i = 0;

        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let unit = 0; unit < board.row * board.column; ++unit) {
            draw.strokeUnit(canvas, ctx, board, unit, strokeColor);
          }
          unitIntervals.forEach((interval) => {
            draw.drawInterval(canvas, ctx, board, interval);
          });
          //const nowUnit = board.dateToUnit(new Date());
          i += 0.05;
          requestId = requestAnimationFrame(render);
        };

        render();
        return () => {
          cancelAnimationFrame(requestId);
        };
      }
    }
  }, [startDate, yearsToShow, scale, canvasSizePx, intervals, strokeColor, draw]);

  return <canvas style={style} ref={canvasRef} />;
}
