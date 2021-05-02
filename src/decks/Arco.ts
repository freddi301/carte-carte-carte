import { repeat } from "../App";
import { Card, double, makeDeck, Riposo } from "./common";

const Freccia: Card = {
  title: "Freccia",
  description: "",
  attack: 5,
  attackType: "thrust",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Arco = makeDeck(double)([
  ...repeat(Freccia, 40),
  ...repeat(Riposo, 20),
]);
