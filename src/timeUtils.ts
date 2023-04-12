const MS_IN_DAY = 24 * 3600 * 1000;
const MS_IN_WEEK = 7 * MS_IN_DAY;
const MS_IN_MONTH = 30 * MS_IN_DAY;
const MS_IN_YEAR = 365 * MS_IN_DAY;

const days = (d1: Date, d2: Date) => {
  return Math.floor((d2.valueOf() - d1.valueOf()) / MS_IN_DAY);
};
const weeks = (d1: Date, d2: Date) => {
  return Math.floor((d2.valueOf() - d1.valueOf()) / MS_IN_WEEK);
};
const months = (d1: Date, d2: Date) => {
  // return (d2.valueOf() - d1.valueOf()) / MS_IN_MONTH;
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};
const years = (d1: Date, d2: Date) => {
  return (d2.valueOf() - d1.valueOf()) / MS_IN_YEAR;
};
const startOfTheYear = (d: Date) => {
  return new Date(d.getFullYear(), 0, 1);
};

export { days, weeks, months, years, startOfTheYear };
