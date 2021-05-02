import { repeat } from "../App";
import { Card, double, makeDeck, Parata, Riposo } from "./common";

const Falciata: Card = {
  title: "Falciata",
  description: "",
  attack: 15,
  attackType: "slash",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Scure = makeDeck(double)([
  ...repeat(Falciata, 11),
  ...repeat(Parata, 7),
  ...repeat(Riposo, 42),
]);
