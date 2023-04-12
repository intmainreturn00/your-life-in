import { Interval, Point, Scale, Size, UnitInterval } from "./LifeBoard";
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
};

const calculateBoard = (startDate: Date, yearsToShow: number, scale: Scale, canvasSizePx: Size) => {
  const row = scale === "YEARS" ? 10 : scale === "MONTHS" ? 12 : 52;
  const column = scale === "YEARS" ? yearsToShow / 10 : yearsToShow;
  const unitSize: Size = { dx: canvasSizePx.dx / row, dy: canvasSizePx.dy / column };
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
  return { startDate, yearsToShow, scale, row, column, unitSize, scaledSize, dateToUnit, unitCenter, intervalToUnits } as Board;
};

export default calculateBoard;
