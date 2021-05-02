import { repeat } from "../App";
import { Card, double, makeDeck, Riposo, Schivata } from "./common";

const Bastonata: Card = {
  title: "Bastonata",
  description: "",
  attack: 5,
  attackType: "impact",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

const ControBastonata: Card = {
  title: "Contro Bastonata",
  description: "",
  attack: 5,
  attackType: "impact",
  defense: 5,
  color: "#9F1239",
  sound: "bam",
};

export const Bastone = makeDeck(double)([
  ...repeat(ControBastonata, 10),
  ...repeat(Bastonata, 10),
  ...repeat(Schivata, 5),
  ...repeat(Riposo, 35),
]);
