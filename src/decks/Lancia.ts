import { repeat } from "../App";
import { Card, double, makeDeck, Parata, Riposo, Schivata } from "./common";

export const ControInfilza: Card = {
  title: "Contro Infilza",
  description: "",
  attack: 5,
  attackType: "thrust",
  defense: 5,
  color: "#9F1239",
  sound: "bam",
};

export const SuperInfilza: Card = {
  title: "Super Infilza",
  description: "",
  attack: 10,
  attackType: "thrust",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Lancia = makeDeck(double)([
  ...repeat(ControInfilza, 2),
  ...repeat(SuperInfilza, 9),
  ...repeat(Parata, 14),
  ...repeat(Schivata, 2),
  ...repeat(Riposo, 33),
]);
