import { Interval } from "./LifeCard";
import colors from "./colors";

const myBirthday = new Date("17 Dec 1991");

const allMyLife: Array<Interval> = [
  {
    A: myBirthday,
    B: new Date(),
    color: colors.button,
    title: "Life",
  },
];

const authoring: Array<Interval> = [
  {
    A: new Date(1991, 11, 17),
    B: new Date(2010, 8, 1),
    color: colors.color5,
    title: "👨🏼‍🌾🐂🐑🛖🏍️👨‍👩‍👦📻",
  },
  {
    A: new Date(1995, 11, 17),
    B: new Date(2010, 8, 1),
    color: colors.color3,
    title: "siberia 👾🦮🎥📚💾⛸️❄️",
  },
  {
    A: new Date(2007, 8, 1),
    B: new Date(2010, 8, 1),
    color: colors.color4,
    title: "👨‍🏫🏫📖 new school 🛤️🚞🏆",
  },
  {
    A: new Date(2010, 6, 1),
    B: new Date(2010, 6, 2),
    color: "transparent",
    title: "♟️",
  },
  {
    A: new Date(2010, 8, 2),
    B: new Date(2015, 2, 1),
    color: colors.color4,
    title: "👨‍🏫📚📓📖university 🗻",
  },
  {
    A: new Date(2013, 6, 1),
    B: new Date(2015, 2, 1),
    color: colors.color1,
    title: "👔💼📑 emc lab",
  },
  {
    A: new Date(2013, 8, 1),
    B: new Date(2013, 8, 2),
    color: "transparent",
    title: "🏆🗃️📑🎓",
  },
  {
    A: new Date(2015, 2, 1),
    B: new Date(2016, 5, 1),
    color: colors.secondary,
    title: "privateering🩼🧘‍♂️🏴‍☠️💻📱",
  },
  {
    A: new Date(2016, 5, 1),
    B: new Date(2018, 5, 1),
    color: colors.color4,
    title: "arrival 🚛💂‍♀️💷🚀",
  },
  {
    A: new Date(2018, 5, 1),
    B: new Date(2019, 8, 1),
    color: colors.secondary,
    title: "name of the wind💃🧘🤸‍♂️",
  },
  {
    A: new Date(2019, 8, 1),
    B: new Date(2022, 5, 1),
    color: colors.color4,
    title: "sweat economy🚶🚴‍♂️📠🤳🪙",
  },
  {
    A: new Date(2022, 2, 1),
    B: new Date(),
    color: colors.pinkactive,
    title: "🏃🚀💥💥📜 alien fiancé 🐫 Exodus",
  },
];

const authoringWithoutEmoji: Array<Interval> = [
  {
    A: new Date(1991, 11, 17),
    B: new Date(2010, 8, 1),
    color: colors.color3,
    title: "siberia",
  },
  {
    A: new Date(2007, 8, 1),
    B: new Date(2010, 8, 1),
    color: colors.color4,
    title: "new school",
  },
  {
    A: new Date(2010, 8, 2),
    B: new Date(2015, 2, 1),
    color: colors.color4,
    title: "university",
  },
  {
    A: new Date(2013, 6, 1),
    B: new Date(2015, 2, 1),
    color: colors.color1,
    title: "emc",
  },
  {
    A: new Date(2015, 2, 1),
    B: new Date(2016, 5, 1),
    color: colors.secondary,
    title: "privateering",
  },
  {
    A: new Date(2016, 5, 1),
    B: new Date(2018, 5, 1),
    color: colors.color4,
    title: "arrival",
  },
  {
    A: new Date(2018, 5, 1),
    B: new Date(2019, 8, 1),
    color: colors.secondary,
    title: "name of the wind",
  },
  {
    A: new Date(2019, 8, 1),
    B: new Date(2022, 5, 1),
    color: colors.color4,
    title: "sweat",
  },
  {
    A: new Date(2022, 2, 1),
    B: new Date(),
    color: colors.pinkactive,
    title: "alien fiancé / exodus",
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
  authoringWithoutEmoji,
};

export { datasets };
