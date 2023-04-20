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
    const lineWidth = board.scale === "YEARS" ? 1.5 : 0.3;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, i: number) {
    ctx.strokeStyle = color;
    const center = board.unitCenter(unit);
    const size = board.scaledSize(board.unitSize, 0.9, 0.9);
    const nowUnit = board.dateToUnit(new Date());
    const animSize = board.animSize(i);
    if (unit === nowUnit) {
      // ctx.strokeRect(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy);
      ctx.strokeRect(center.x - animSize.dx / 2, center.y - animSize.dy / 2, animSize.dx, animSize.dy);
    } else {
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
    const size = board.scaledSize(board.unitSize, 1, 1);
    const nowUnit = board.dateToUnit(new Date());
    const animSize = board.animSize(i);
    if (unit === nowUnit) {
      ctx.fillRect(
        center.x - animSize.dx / 2 + from * animSize.dx,
        center.y - animSize.dy / 2,
        animSize.dx * (to - from),
        animSize.dy
      );
      ctx.fillStyle = colors.background;
      ctx.fillRect(
        center.x - animSize.dx / 2 + to * animSize.dx,
        center.y - animSize.dy / 2,
        animSize.dx * (1 - to),
        animSize.dy
      );
    } else {
      ctx.fillRect(center.x - size.dx / 2 + from * size.dx, center.y - size.dy / 2, size.dx * (to - from), size.dy);
    }
  }
  drawInterval(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, interval: UnitInterval, i: number) {
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
  fillUnit(
    canvas: HTMLCanvas,
    ctx: CanvasContext,
    board: Board,
    unit: number,
    color: string,
    from: number,
    to: number
  ) {
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
    const lineWidth = board.scale === "YEARS" ? 1 : 0.2;
    retinaCanvasScaling(canvas, ctx, canvasSizePx);
    ctx.lineWidth = lineWidth;
    this.config = {
      options: {
        roughness: 2,
        bowing: 2,
        fillWeight: 4,
        strokeWidth: lineWidth,
        seed: Math.floor(Math.random() * 100),
      },
    };
    const rc = rough.canvas(canvas, this.config);
    this.grid = [];
    this.intervalsDrawables = new Map();
    for (let unit = 0; unit < board.row * board.column; ++unit) {
      const center = board.unitCenter(unit);
      const size = board.scaledSize(board.unitSize, 0.9, 0.9);
      this.grid.push(rc.generator.rectangle(center.x - size.dx / 2, center.y - size.dy / 2, size.dx, size.dy));
    }
  }
  strokeUnit(canvas: HTMLCanvas, ctx: CanvasContext, board: Board, unit: number, color: string, i: number) {
    const rc: RoughCanvas = rough.canvas(canvas, this.config);
    const nowUnit = board.dateToUnit(new Date());
    if (unit !== nowUnit) {
      rc.draw(this.grid[unit]);
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
            strokeWidth: board.scale === "YEARS" ? 2 : 0.5,
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
        hachureAngle: -45,
        strokeWidth: board.scale === "YEARS" ? 2 : 0.5,
      });
      this.intervalsDrawables.set(interval, drawable);
      rc.draw(drawable);
    } else {
      rc.draw(drawable);
    }
    const nowUnit = board.dateToUnit(new Date());
    const centerNow = board.unitCenter(nowUnit);
    const size = board.scaledSize(board.unitSize, 1, 1);
    if (nowUnit > interval.A && nowUnit <= interval.B) {
      ctx.fillStyle = colors.background;
      ctx.fillRect(centerNow.x - size.dx / 2, centerNow.y - size.dy / 2, size.dx, size.dy);
      this.fillUnit(canvas, ctx, board, nowUnit, interval.color, 0, board.animPct(interval.to, i), i);
    }
  }
}
