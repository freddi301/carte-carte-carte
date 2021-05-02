import { repeat } from "../App";
import { Card, makeDeck, Riposo, single } from "./common";
import { ControInfilza } from "./Lancia";

export const Infilza: Card = {
  title: "Infilza",
  description: "",
  attack: 5,
  attackType: "thrust",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Stocco = makeDeck(single)([
  ...repeat(Infilza, 12),
  ...repeat(ControInfilza, 4),
  ...repeat(Riposo, 14),
]);
