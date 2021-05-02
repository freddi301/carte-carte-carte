import { repeat } from "../App";
import { Card, double, makeDeck, Riposo } from "./common";
import { ControSpadata, Spadata } from "./Spada";

export const SuperSpadata: Card = {
  title: "Super Spadata",
  description: "",
  attack: 15,
  attackType: "slash",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Spadone = makeDeck(double)([
  ...repeat(SuperSpadata, 5),
  ...repeat(ControSpadata, 10),
  ...repeat(Spadata, 5),
  ...repeat(Riposo, 40),
]);
