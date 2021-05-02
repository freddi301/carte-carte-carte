import { repeat } from "../App";
import { Card, double, makeDeck, Parata, Riposo } from "./common";

const Martellata: Card = {
  title: "Martellata",
  description: "",
  attack: 15,
  attackType: "impact",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Martello = makeDeck(double)([
  ...repeat(Martellata, 7),
  ...repeat(Parata, 19),
  ...repeat(Riposo, 34),
]);
