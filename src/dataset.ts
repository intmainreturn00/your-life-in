import { Interval } from "./LifeBoard";

const myBirthday = new Date("17 Dec 1991");

const allMyLife: Array<Interval> = [
  {
    A: myBirthday,
    B: new Date(),
    color: "aquamarine",
    title: "Life",
  },
];

const authoring: Array<Interval> = [
  {
    A: new Date(1991, 11, 17),
    B: new Date(2010, 8, 1),
    color: "blueviolet",
    title: "Omsk",
  },
  {
    A: new Date(2010, 8, 2),
    B: new Date(2015, 2, 1),
    color: "dodgerblue",
    title: "University, EMC",
  },
  {
    A: new Date(2015, 2, 1),
    B: new Date(2016, 5, 1),
    color: "aquamarine",
    title: "Sabbatical 1",
  },
  {
    A: new Date(2016, 5, 1),
    B: new Date(2018, 5, 1),
    color: "hotpink",
    title: "Arrival",
  },
  {
    A: new Date(2018, 5, 1),
    B: new Date(2019, 8, 1),
    color: "aquamarine",
    title: "Sabbatical 2",
  },
  {
    A: new Date(2019, 8, 1),
    B: new Date(2022, 5, 1),
    color: "hotpink",
    title: "Sweat",
  },
  {
    A: new Date(2022, 5, 1),
    B: new Date(),
    color: "aquamarine",
    title: "Alien fiancé, Exodus",
  },
];

const test: Array<Interval> = [
  {
    A: new Date(1991, 11, 17),
    B: new Date(),
    color: "aquamarine",
    title: "Life",
  },
  {
    A: new Date(2019, 8, 1),
    B: new Date(2022, 5, 1),
    color: "hotpink",
    title: "Sweat",
  },
  {
    A: new Date(2016, 5, 1),
    B: new Date(2018, 5, 1),
    color: "hotpink",
    title: "Arrival",
  },
];

const datasets = {
  allMyLife,
  authoring,
  test,
  myBirthday,
};

export { datasets };
