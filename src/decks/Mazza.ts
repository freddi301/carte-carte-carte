import { repeat } from "../App";
import { Card, Intercetta, makeDeck, Riposo, single } from "./common";

const Mazzata: Card = {
  title: "Mazzata",
  description: "",
  attack: 7,
  attackType: "impact",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Mazza = makeDeck(single)([
  ...repeat(Mazzata, 10),
  ...repeat(Intercetta, 10),
  ...repeat(Riposo, 10),
]);
