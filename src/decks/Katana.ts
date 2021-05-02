import { repeat } from "../App";
import { double, makeDeck, Riposo } from "./common";
import { ControSpadata, Spadata } from "./Spada";
import { SuperSpadata } from "./Spadone";

export const Katana = makeDeck(double)([
  ...repeat(SuperSpadata, 7),
  ...repeat(ControSpadata, 2),
  ...repeat(Spadata, 15),
  ...repeat(Riposo, 36),
]);
