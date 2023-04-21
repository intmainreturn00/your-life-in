import React, { useRef, useEffect, useMemo, useState } from "react";

import { Draw, NormalDraw, RoughDraw } from "./drawings";
import { calculateBoard } from "./board";

export type Scale = "WEEKS" | "MONTHS" | "YEARS";
export type DrawStyle = "OK" | "FUNKY";

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
  drawStyle: DrawStyle;
};

export default function LifeCard({
  startDate,
  yearsToShow,
  scale,
  intervals,
  canvasSizePx,
  style,
  strokeColor,
  drawStyle,
}: LifeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const normalDraw = useMemo(() => new NormalDraw(), []);
  const roughDraw = useMemo(() => new RoughDraw(), []);

  useEffect(() => {
    const board = calculateBoard(startDate, yearsToShow, scale, canvasSizePx, drawStyle);
    const unitIntervals = intervals ? board.intervalToUnits(intervals) : [];
    const draw = drawStyle === "OK" ? normalDraw : roughDraw;

    if (canvasRef.current) {
      ctxRef.current = canvasRef.current.getContext("2d");
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      //
      if (ctx) {
        // init ==============================
        draw.initCanvas(canvas, ctx, board, canvasSizePx, strokeColor);
        let requestId: number;
        let i = 0;
        const render = (i: number) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (board.scale === "YEARS") {
            unitIntervals.forEach((interval) => {
              draw.drawInterval(canvas, ctx, board, interval, i);
            });
            draw.drawGrid(canvas, ctx, board, strokeColor);
          } else {
            draw.drawGrid(canvas, ctx, board, strokeColor);
            unitIntervals.forEach((interval) => {
              draw.drawInterval(canvas, ctx, board, interval, i);
            });
          }

          // if (i > 1000) {

          //   i = 0;
          // }
          i += 0.05;
          // requestId = requestAnimationFrame(render);
        };
        render(i);
        return () => {
          cancelAnimationFrame(requestId);
        };
      }
    }
  }, [startDate, yearsToShow, scale, canvasSizePx, intervals, strokeColor, drawStyle, normalDraw, roughDraw]);

  return <canvas style={style} ref={canvasRef} />;
}
