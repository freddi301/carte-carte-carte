import { makeDeck, Card, single, Parata, Riposo } from "./common";
import { repeat } from "../App";

export const Spadata: Card = {
  title: "Spadata",
  description: "",
  attack: 5,
  attackType: "slash",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const ControSpadata: Card = {
  title: "Spadata",
  description: "",
  attack: 5,
  attackType: "slash",
  defense: 5,
  color: "#9F1239",
  sound: "bam",
};

export const Spada = makeDeck(single)([
  ...repeat(Spadata, 8),
  ...repeat(ControSpadata, 2),
  ...repeat(Parata, 8),
  ...repeat(Riposo, 12),
]);
