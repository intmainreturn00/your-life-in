import { Size, UnitInterval } from "./LifeCard";
import retinaCanvasScaling from "./retinaCanvasScaling";
import { Board } from "./board";
import { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs/bin/rough";
import { Config, Drawable } from "roughjs/bin/core";
import { Point } from "roughjs/bin/geometry";
import colors from "./colors";

type HTMLCanvas = HTMLCanvasElement;
type CanvasContext = CanvasRenderingContext2D;
export interface Draw {
  initCanvas: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) => void;
  drawGrid: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, strokeColor: string) => void;
  strokeUnit: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, i: number) => void;
  fillUnit: (
    canvas: HTMLCanvas,
    ctx: CanvasContext,
    board: Board,
    unit: number,
    color: string,
    from: number,
    to: number
  ) => void;
  drawInterval: (canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval, i: number) => void;
}
export class NormalDraw {
  initCanvas(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) {
    const lineWidth = board.scale === "YEARS" ? 1.5 : 0.2;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, i: number) {
    ctx.strokeStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, board.scale === "YEARS" ? 0.8 : 1, board.scale === "YEARS" ? 0.8 : 1);
    const nowUnit = board.dateToUnit(new Date());
    const animSize = board.animSize(i);
    if (unit === nowUnit) {
      ctx.strokeRect(center.x - animSize.dx / 2, center.y - animSize.dy / 2, animSize.dx, animSize.dy);
    } else {
      ctx.strokeRect(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy);
    }
  }
  drawGrid(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, strokeColor: string) {
    ctx.strokeStyle = strokeColor;
    // ctx.lineWidth = 1;
    ctx.lineWidth = 0.1;
    const size = board.scaledSize(board.unitSize, board.scale === "YEARS" ? 0.8 : 1, board.scale === "YEARS" ? 0.8 : 1);
    for (let unit = 0; unit < board.row * board.column; ++unit) {
      const center = board.unitCenter(unit);
      ctx.strokeRect(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy);
    }
  }
  fillUnit(
    canvas: HTMLCanvas,
    ctx: CanvasContext,
    board: Board,
    unit: number,
    color: string,
    from: number,
    to: number,
    i: number
  ) {
    ctx.fillStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, board.scale === "YEARS" ? 0.8 : 1, board.scale === "YEARS" ? 0.8 : 1);
    ctx.fillRect(center.x - size.dx / 2 + from * size.dx, center.y - size.dy / 2, size.dx * (to - from), size.dy);
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval, i: number) {
    ctx.lineWidth = board.scale === "YEARS" ? 0.5 : 0.1;
    for (let unit = interval.A; unit <= interval.B; ++unit) {
      this.fillUnit(
        canvas,
        ctx,
        board,
        unit,
        interval.color,
        unit === interval.A ? interval.from : 0,
        unit === interval.B ? interval.to : 1,
        i
      );
      // this.strokeUnit(canvas, ctx, board, unit, colors.stroke, i);
    }

    const size = board.scaledSize(board.unitSize, 1, 1);

    ctx.lineWidth = board.scale === "YEARS" ? 0.5 : 0.9;
    // const size = board.scaledSize(board.unitSize, 1, 1);
    ctx.font = `${size.dy / 2}px Nova Oval italic`;
    ctx.textBaseline = "middle";

    if (board.scale !== "YEARS") {
      ctx.fillStyle = colors.stroke;
      const rowNum = Math.abs(Math.ceil(interval.B / board.row) - Math.ceil(interval.A / board.row));
      ctx.font = `${2 * size.dy}px Nova Oval`;
      if (rowNum < 2) {
        const center = board.unitCenter(interval.A);
        ctx.font = `${1.5 * size.dy}px Nova Oval`;
        ctx.fillStyle = colors.stroke;
        ctx.strokeStyle = colors.strokeOpac;
        const maxWidth = board.row * size.dx - center.x + 1.5 * size.dx;
        ctx.fillText(interval.title, center.x + size.dx / 2, center.y + size.dy / 2, maxWidth);
      } else {
        const line = Math.floor(interval.A / board.row) * board.row;
        const center = board.unitCenter(line);
        ctx.fillStyle = colors.stroke;
        ctx.strokeStyle = colors.stroke;
        ctx.fillText(interval.title, size.dy, center.y + 1.5 * size.dy);
      }

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
        path.push([size.dx * board.row - 1, centerA.y - size.dy / 2]);
        path.push([size.dx * board.row - 1, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y + size.dy / 2]);
        path.push([1, centerB.y + size.dy / 2]);
        path.push([1, centerA.y + size.dy / 2]);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.5;
      ctx.fillStyle = colors.stroke;
      ctx.strokeStyle = colors.stroke;
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; ++i) {
        ctx.lineTo(path[i][0], path[i][1]);
      }
      ctx.lineTo(path[0][0], path[0][1]);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

export class RoughDraw {
  config: Config | undefined = undefined;
  grid: Array<Drawable> = [];
  intervalsDrawables: Map<UnitInterval, Drawable> = new Map();

  initCanvas(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, canvasSizePx: Size, strokeColor: string) {
    const lineWidth = board.scale === "YEARS" ? 0.2 : 0.1;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
    this.config = {
      options: {
        roughness: 1,
        bowing: 1,
        fillWeight: 4,
        strokeWidth: lineWidth,
        seed: Math.floor(Math.random() * 100),
      },
    };
    const rc = rough.canvas(canvas, this.config);
    this.grid = [];
    this.intervalsDrawables = new Map();
    const size = board.scaledSize(board.unitSize, 1, 1);
    for (let unit = 0; unit < board.row + 1; ++unit) {
      this.grid.push(rc.line(size.dx * unit, 0, size.dx * unit, size.dy * board.column + size.dy / 2));
    }
    for (let unit = 0; unit < board.column + 1; ++unit) {
      this.grid.push(rc.line(0, size.dy * unit, size.dx * board.row, size.dy * unit));
    }
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, i: number) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    const nowUnit = board.dateToUnit(new Date());
    if (unit !== nowUnit) {
      rc.draw(this.grid[unit]);
    }
  }
  drawGrid(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, strokeColor: string) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    if (board.scale === "YEARS") {
      const size = board.scaledSize(board.unitSize, 0.9, 0.9);
      for (let unit = 0; unit < board.row * board.column; ++unit) {
        const center = board.unitCenter(unit);
        rc.draw(rc.generator.rectangle(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy));
      }
    } else {
      this.grid.forEach((dr) => rc.draw(dr));
    }
  }
  fillUnit(
    canvas: HTMLCanvas,
    ctx: CanvasContext,
    board: Board,
    unit: number,
    color: string,
    from: number,
    to: number,
    i: number
  ) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    const nowUnit = board.dateToUnit(new Date());
    if (unit === nowUnit) {
      rc.draw(
        rc.rectangle(
          center.x - size.dx / 2 /*+ from * animSize.dx*/,
          center.y - size.dy / 2,
          size.dx * (to - from),
          size.dy,
          {
            fill: color,
            fillWeight: board.scale === "YEARS" ? 2 : 1,
            fillStyle: "solid",
            hachureAngle: -45,
          }
        )
      );
    } else {
      rc.draw(
        rc.rectangle(center.x - size.dx / 2 + from * size.dx, center.y - size.dy / 2, size.dx * (to - from), size.dy, {
          fill: color,
        })
      );
    }
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval, i: number) {
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
        path.push([size.dx * board.row - 1, centerA.y - size.dy / 2]);
        path.push([size.dx * board.row - 1, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y - size.dy / 2]);
        path.push([centerB.x - size.dx / 2 + interval.to * size.dx, centerB.y + size.dy / 2]);
        path.push([1, centerB.y + size.dy / 2]);
        path.push([1, centerA.y + size.dy / 2]);
      }
      drawable = rc.generator.polygon(path, {
        fill: interval.color,
        fillWeight: board.scale === "YEARS" ? 4 : 1,
        fillStyle: "zigzag",
        // stroke: "transparent",
        hachureAngle: -45,
        strokeWidth: board.scale === "YEARS" ? 0.3 : 0.5,
      });
      this.intervalsDrawables.set(interval, drawable);
      rc.draw(drawable);
    } else {
      rc.draw(drawable);
    }
    const nowUnit = board.dateToUnit(new Date());
    const size = board.scaledSize(board.unitSize, 1, 1);
    if (nowUnit > interval.A && nowUnit <= interval.B) {
      ctx.fillStyle = colors.background;
      this.fillUnit(canvas, ctx, board, nowUnit, interval.color, 0, interval.to, i);
    }
    ctx.lineWidth = board.scale === "YEARS" ? 0.5 : 0.9;
    ctx.font = `${size.dy / 2}px Sedgwick Ave Display`;
    ctx.textBaseline = "middle";
    if (board.scale !== "YEARS") {
      ctx.fillStyle = colors.stroke;
      const rowNum = Math.abs(Math.ceil(interval.B / board.row) - Math.ceil(interval.A / board.row));
      ctx.font = `${2 * size.dy}px Sedgwick Ave Display`;
      if (rowNum < 2) {
        const center = board.unitCenter(interval.A);
        ctx.font = `${1.5 * size.dy}px Sedgwick Ave Display`;
        ctx.fillStyle = colors.stroke;
        ctx.strokeStyle = colors.strokeOpac;
        const maxWidth = board.row * size.dx - center.x + 1.5 * size.dx;
        ctx.fillText(interval.title, center.x + size.dx / 2, center.y + size.dy / 2, maxWidth);
      } else {
        const line = Math.floor(interval.A / board.row) * board.row;
        const center = board.unitCenter(line);
        ctx.fillStyle = colors.stroke;
        ctx.strokeStyle = colors.stroke;
        ctx.fillText(interval.title, size.dy, center.y + 1.5 * size.dy);
      }
    }
  }
}
