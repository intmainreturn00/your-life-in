import { Size, UnitInterval } from "./LifeBoard";
import retinaCanvasScaling from "./retinaCanvasScaling";
import { Board } from "./board";
import { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs/bin/rough";
import { Config, Drawable } from "roughjs/bin/core";
import { Point } from "roughjs/bin/geometry";

type HTMLCanvas = HTMLCanvasElement;
type CanvasContext = CanvasRenderingContext2D;
export interface Draw {
  initCanvas: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) => void;
  strokeUnit: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string) => void;
  fillUnit: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, from: number, to: number) => void;
  drawInterval: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval) => void;
}
export class NormalDraw {
  initCanvas(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) {
    const lineWidth = board.scale === "YEARS" ? 1.5 : 0.3;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string) {
    ctx.strokeStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    ctx.strokeRect(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy);
  }
  fillUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, from: number, to: number) {
    ctx.fillStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    ctx.fillRect(center.x - size.dx / 2 + from * size.dx, center.y - size.dy / 2, size.dx * (to - from), size.dy);
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval) {
    for (let unit = interval.A; unit <= interval.B; ++unit) {
      this.fillUnit(
        canvas,
        ctx,
        board,
        unit,
        interval.color,
        unit === interval.A ? interval.from : 0,
        unit === interval.B ? interval.to : 1
      );
    }
  }
}

export class DiamondDraw {
  initCanvas(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) {
    const lineWidth = board.scale === "YEARS" ? 1.5 : 0.3;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string) {
    ctx.strokeStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    const path = [
      [center.x - size.dx / 2, center.y],
      [center.x, center.y - size.dy / 2],
      [center.x + size.dx / 2, center.y],
      [center.x, center.y + size.dy / 2],
    ];
    ctx.beginPath();
    ctx.moveTo(path[0][0], path[0][1]);
    path.forEach((value) => {
      ctx.lineTo(value[0], value[1]);
    });
    ctx.closePath();
    ctx.stroke();
  }
  fillUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, from: number, to: number) {
    ctx.fillStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    const startX = center.x - size.dx / 2 + from * size.dx;
    const endX = center.x - size.dx / 2 + to * size.dx;
    const startYTop = from < 0.5 ? center.y - from * size.dy : center.y - size.dy / 2 + (from - 0.5) * size.dy;
    const startYBottom = from < 0.5 ? center.y + from * size.dy : center.y + size.dy / 2 - (from - 0.5) * size.dy;
    const endYTop = to < 0.5 ? center.y - to * size.dy : center.y - size.dy / 2 + (to - 0.5) * size.dy;
    const endYBottom = to < 0.5 ? center.y + to * size.dy : center.y + size.dy / 2 - (to - 0.5) * size.dy;

    const path = [];
    path.push([startX, startYTop]);
    if (from < 0.5 && to > 0.5) {
      path.push([center.x, center.y - size.dy / 2]);
    }
    path.push([endX, endYTop]);
    path.push([endX, endYBottom]);
    if (from < 0.5 && to > 0.5) {
      path.push([center.x, center.y + size.dy / 2]);
    }
    path.push([startX, startYBottom]);

    ctx.beginPath();
    ctx.moveTo(path[0][0], path[0][1]);
    path.forEach((value) => {
      ctx.lineTo(value[0], value[1]);
    });
    ctx.fill();
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval) {
    for (let unit = interval.A; unit <= interval.B; ++unit) {
      this.fillUnit(
        canvas,
        ctx,
        board,
        unit,
        interval.color,
        unit === interval.A ? interval.from : 0,
        unit === interval.B ? interval.to : 1
      );
    }
  }
}

export class RoughDraw {
  config: Config | undefined = undefined;
  grid: Array<Drawable> = [];
  intervalsDrawables: Map<UnitInterval, Drawable> = new Map();

  initCanvas(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) {
    const lineWidth = board.scale === "YEARS" ? 1.5 : 0.1;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
    this.config = {
      options: {
        roughness: 1,
        bowing: 2,
        strokeWidth: lineWidth,
        seed: Math.floor(Math.random() * 100),
        stroke: strokeColor,
        fillStyle: "cross-hatch",
        hachureAngle: 90,
      },
    };
    const rc = rough.canvas(canvas, this.config);
    this.grid = [];
    for (let unit = 0; unit < board.row * board.column; ++unit) {
      const center = board.unitCenter(unit);
      const size = board.scaledSize(board.unitSize, 0.9, 0.9);
      this.grid.push(rc.generator.rectangle(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy));
    }
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    rc.draw(this.grid[unit]);
  }
  fillUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, from: number, to: number) {
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    rc.draw(
      rc.rectangle(center.x - size.dx / 2 + from * size.dx, center.y - size.dy / 2, size.dx * (to - from), size.dy, {
        fill: color,
      })
    );
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    let drawable = this.intervalsDrawables.get(interval);
    if (drawable === undefined) {
      const size = board.scaledSize(board.unitSize, 1, 1);
      const centerA = board.unitCenter(interval.A);
      const centerB = board.unitCenter(interval.B);
      const path: Point[] = [];
      if (Math.ceil(interval.A / board.row) === Math.ceil(interval.B / board.row)) {
        // on the same line
        path.push([centerA.x - size.dx / 2 + interval.from * size.dx, centerA.y - size.dy / 2]);
        path.push([centerA.x - size.dx / 2 + interval.from * size.dx, centerA.y + size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y + size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y - size.dy / 2]);
      } else {
        // multi-line shape
        path.push([centerA.x - size.dx / 2 + interval.from * size.dx, centerA.y + size.dy / 2]);
        path.push([centerA.x - size.dx / 2 + interval.from * size.dx, centerA.y - size.dy / 2]);
        path.push([size.dx * board.row + size.dx, centerA.y - size.dy / 2]);
        path.push([size.dx * board.row + size.dx, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y + size.dy / 2]);
        path.push([0, centerB.y + size.dy / 2]);
        path.push([0, centerA.y + size.dy / 2]);
      }
      drawable = rc.generator.polygon(path, {
        fill: interval.color,
      });
      this.intervalsDrawables.set(interval, drawable);
    } else {
      rc.draw(drawable);
    }
  }
}
