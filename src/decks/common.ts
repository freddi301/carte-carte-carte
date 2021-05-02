export type Card = {
  title: string;
  description: string;
  attack: number;
  attackType: AttackType;
  defense: number;
  color: string;
  sound: string;
};

export type AttackType = "slash" | "impact" | "thrust";

export function makeDeck({
  totalCards,
  totalEnergy,
  totalAttack,
}: {
  totalCards: number;
  totalAttack: number;
  totalEnergy: number;
}) {
  return (cards: Array<Card>) => {
    if (cards.length < totalCards)
      throw new Error(`not enough cards ${cards.length} < ${totalCards}`);
    if (cards.length > totalCards)
      throw new Error(`too much cards ${cards.length} > ${totalCards}`);
    const [attack, defense] = cards.reduce(
      ([attack, defense], card) => [
        attack + card.attack,
        defense + card.defense,
      ],
      [0, 0]
    );
    if (attack < totalAttack)
      throw new Error(`not enough attack ${attack} < ${totalAttack}`);
    const energy = attack + defense;
    if (energy < totalEnergy)
      throw new Error(`not enough energy ${energy} < ${totalEnergy}`);
    if (energy > totalEnergy)
      throw new Error(`too much energy ${energy} > ${totalEnergy}`);
    return cards;
  };
}

export const single = { totalCards: 30, totalEnergy: 100, totalAttack: 50 };
export const double = { totalCards: 60, totalEnergy: 200, totalAttack: 100 };

export const Riposo: Card = {
  title: "Riposo",
  description: "",
  attack: 0,
  attackType: "slash",
  defense: 0,
  color: "#71717A",
  sound: "ha",
};

export const Parata: Card = {
  title: "Parata",
  description: "",
  attack: 0,
  attackType: "slash",
  defense: 5,
  color: "#3B82F6",
  sound: "he",
};

export const Intercetta: Card = {
  title: "Intercetta",
  description: "",
  attack: 0,
  attackType: "slash",
  defense: 3,
  color: "#3B82F6",
  sound: "he",
};

export const Schivata: Card = {
  title: "Schivata",
  description: "",
  attack: 0,
  attackType: "slash",
  defense: 10,
  color: "#3B82F6",
  sound: "he",
};
