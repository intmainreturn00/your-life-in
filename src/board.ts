import { Interval, Point, Scale, Size, UnitInterval } from "./LifeCard";
import { startOfTheYear, weeks, months, years } from "./timeUtils";

export type Board = {
  startDate: Date;
  yearsToShow: number;
  scale: Scale;
  row: number;
  column: number;
  unitSize: Size;
  scaledSize: (size: Size, scalingX: number, scalingY: number) => Size;
  dateToUnit: (d: Date) => number;
  unitCenter: (unitNumber: number) => Point;
  intervalToUnits: (intervals: Array<Interval>) => Array<UnitInterval>;
  animSize: (i: number) => Size;
  animPct: (pct: number, i: number) => number;
};

export const calculateBoard = (startDate: Date, yearsToShow: number, scale: Scale, canvasSizePx: Size) => {
  const row = scale === "YEARS" ? 10 : scale === "MONTHS" ? 12 : 52;
  const column = scale === "YEARS" ? yearsToShow / 10 : yearsToShow;
  const unitSize: Size = {
    dx:
      scale === "YEARS"
        ? Math.min(canvasSizePx.dx, canvasSizePx.dy) / Math.max(row, column)
        : (canvasSizePx.dx - 5) / row,
    dy:
      scale === "YEARS"
        ? Math.min(canvasSizePx.dx, canvasSizePx.dy) / Math.max(row, column)
        : (canvasSizePx.dy - 5) / column,
  };
  const diff: (d1: Date, d2: Date) => number = scale === "YEARS" ? years : scale === "MONTHS" ? months : weeks;
  const dateToUnit = (d: Date) => {
    return Math.floor(diff(startOfTheYear(startDate), d));
  };
  const scaledSize = (size: Size, scalingX: number, scalingY: number) => {
    const newSize: Size = {
      dx: size.dx * scalingX,
      dy: size.dy * scalingY,
    };
    return newSize;
  };
  const unitCenter = (unitNumber: number) => {
    const y = Math.floor(unitNumber / row);
    const x = unitNumber - y * row;
    const center: Point = { x: x * unitSize.dx + unitSize.dx / 2, y: y * unitSize.dy + unitSize.dy / 2 };
    return center;
  };
  const intervalToUnits = (intervals: Array<Interval>) => {
    const pctRounding = (pct: number, rounder: (v: number) => number, base: number = 20) => {
      return pct > 0 && pct < 1 ? (rounder((pct * 100) / base) * base) / 100 : pct;
    };
    const res: Array<UnitInterval> = [];
    intervals.forEach((interval) => {
      const unitA = dateToUnit(interval.A);
      const unitB = dateToUnit(interval.B);
      const from = pctRounding(years(startOfTheYear(interval.A), interval.A), Math.floor);
      const to = pctRounding(years(startOfTheYear(interval.B), interval.B), Math.ceil);
      res.push({ A: unitA, B: unitB, from: from, to: to, color: interval.color, title: interval.title });
    });
    return res;
  };
  const animSize = (i: number) => {
    const anim = Math.min(1.1, Math.sin(i / 500));
    // const anim = Math.max(0.9, 1.2 * Math.sin(i / 300));
    // const anim = Math.max(1, 1.2 * Math.sin(i / 150));
    return board.scaledSize(unitSize, anim, anim);
  };
  const animPct = (pct: number, i: number) => {
    return 0.9 * pct * Math.abs(Math.sin(i / 500));
  };
  const board: Board = {
    startDate: startDate,
    yearsToShow: yearsToShow,
    scale: scale,
    row: row,
    column: column,
    unitSize: unitSize,
    scaledSize: scaledSize,
    dateToUnit: dateToUnit,
    unitCenter: unitCenter,
    intervalToUnits: intervalToUnits,
    animSize: animSize,
    animPct: animPct,
  };
  return board;
};
