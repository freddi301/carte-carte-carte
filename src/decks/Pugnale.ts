import { repeat } from "../App";
import { Card, Intercetta, makeDeck, single } from "./common";

const Pugnalata: Card = {
  title: "Pugnalata",
  description: "",
  attack: 3,
  attackType: "slash",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

const Zaccagnata: Card = {
  title: "Zaccagnata",
  description: "",
  attack: 8,
  attackType: "thrust",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Pugnale = makeDeck(single)([
  ...repeat(Pugnalata, 14),
  ...repeat(Intercetta, 14),
  ...repeat(Zaccagnata, 2),
]);
