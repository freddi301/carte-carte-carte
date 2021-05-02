import { repeat } from "../App";
import { Card, makeDeck, Riposo, single } from "./common";

const Accettata: Card = {
  title: "Accettata",
  description: "",
  attack: 10,
  attackType: "slash",
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

export const Ascia = makeDeck(single)([
  ...repeat(Accettata, 10),
  ...repeat(Riposo, 20),
]);
