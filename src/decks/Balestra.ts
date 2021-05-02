import { repeat } from "../App";
import { Card, double, makeDeck, Parata, Riposo } from "./common";

const Dardo: Card = {
  title: "Dardo",
  description: "",
  attack: 15,
  attackType: "thrust",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Balestra = makeDeck(double)([
  ...repeat(Dardo, 13),
  Parata,
  ...repeat(Riposo, 46),
]);
