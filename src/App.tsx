import React, { useMemo, useState } from "react";
import { css } from "styled-components/macro";

// strength (enhance : heavy attack, heavy defence)
// dexterity (enhance : light attack, light defence)
// intellignece (more powerful attack magic, more defensive magic)
// wisdom (more attack magic, more powerful defensive magic)

export default function App() {
  const [leftDeckName, leftDeck] = useMemo(() => randomDeck(), []);
  const [rightDeckName, rightDeck] = useMemo(() => randomDeck(), []);
  const [fight, setFight] = useState(() =>
    startFight({ hp: 80, deck: leftDeck }, { hp: 80, deck: rightDeck })
  );
  const fightState = getFightState(fight);
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        background-color: #e4e4e7;
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-template-rows: auto 1fr;
      `}
    >
      <div
        css={css`
          grid-row: 1;
          grid-column: 1 / span 2;
          text-align: center;
        `}
      >
        <h2>Round: {fight.round}</h2>
        {(() => {
          switch (fightState) {
            case "lose":
              return (
                <h2
                  css={css`
                    color: #be123c;
                  `}
                >
                  GAME OVER ☠
                </h2>
              );
            case "win":
              return (
                <h2
                  css={css`
                    color: #0ea5e9;
                  `}
                >
                  VICTORY 🖕
                </h2>
              );
          }
        })()}
      </div>
      <div
        css={css`
          grid-row: 2;
          grid-column: 1;
        `}
      >
        <div
          css={css`
            padding: 40px;
          `}
        >
          <h1>{leftDeckName}</h1>
          <Healthbar health={fight.left.hp} />
          <Deck deck={fight.left.deck} />
        </div>
        <div
          css={css`
            display: flex;
          `}
        >
          {fight.left.hand.map((card, index) => {
            return (
              <Card
                key={index}
                card={card}
                onPlay={() => {
                  if (fightState === "tie") {
                    setFight(playCard(index, fight));
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        css={css`
          grid-row: 2;
          grid-column: 2;
        `}
      >
        <div
          css={css`
            padding: 40px;
          `}
        >
          <h1>{rightDeckName}</h1>
          <Healthbar health={fight.right.hp} />
          <Deck deck={fight.right.deck} />
        </div>
        <Card card={fight.right.hand} />
      </div>
    </div>
  );
}

function Healthbar({ health }: { health: number }) {
  return <div css={css``}>{"❤️".repeat(Math.max(0, health))}</div>;
}

function Deck({ deck }: { deck: Array<Card> }) {
  return <div>{"🂡".repeat(deck.length)}</div>;
}

function Card({ card, onPlay }: { card: Card; onPlay?(): void }) {
  return (
    <div
      css={css`
        width: 6.35cm;
        height: 8.89cm;
        border-radius: 0.5cm;
        padding: 1cm;
        margin: 0.5cm;
        box-sizing: border-box;
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
          rgba(0, 0, 0, 0.23) 0px 6px 6px;
        transition: 0.5s;
        background-color: ${card.color};
        &:hover {
          transform: scale(1.2);
        }
      `}
      onClick={onPlay}
    >
      <h2>{card.title}</h2>
      <p
        css={css`
          font-size: 20px;
          font-weight: bold;
          word-break: break-all;
        `}
      >
        {"⚔".repeat(card.attack)}
        <br />
        {"🛡️".repeat(card.defense)}
      </p>
    </div>
  );
}

type Card = {
  title: string;
  description: string;
  attack: number;
  defense: number;
  color: string;
};

type Fight = {
  round: number;
  left: {
    hp: number;
    deck: Array<Card>;
    hand: Array<Card>;
  };
  right: {
    hp: number;
    deck: Array<Card>;
    hand: Card;
  };
};

function startFight(
  left: { hp: number; deck: Array<Card> },
  right: { hp: number; deck: Array<Card> }
): Fight {
  const [rightHand, rightDeck] = drawCard(right.deck);
  const [leftHand, leftDeck] = drawCards(left.deck, 3);
  return {
    round: 0,
    left: {
      hp: left.hp,
      deck: leftDeck,
      hand: leftHand,
    },
    right: {
      hp: right.hp,
      deck: rightDeck,
      hand: rightHand,
    },
  };
}

function playCard(cardIndex: number, fight: Fight): Fight {
  const [leftCard, newLeftHand1] = removeCard(cardIndex, fight.left.hand);
  const [rightHand, newRightDeck] = drawCard(fight.right.deck);
  const rightCard = fight.right.hand;
  const leftDamage = Math.max(0, rightCard.attack - leftCard.defense);
  const rightDamage = Math.max(0, leftCard.attack - rightCard.defense);
  const [newLeftCards2, newLeftDeck1] = drawCards(fight.left.deck, 2);
  const [leftRecycledCard, newLeftHand2] = removeCard(0, newLeftHand1);
  const newLeftHand3 = [...newLeftHand2, ...newLeftCards2];
  const newLeftDeck2 = [...newLeftDeck1, leftRecycledCard];
  return {
    round: fight.round + 1,
    left: {
      hp: fight.left.hp - leftDamage,
      deck: newLeftDeck2,
      hand: newLeftHand3,
    },
    right: {
      hp: fight.right.hp - rightDamage,
      deck: newRightDeck,
      hand: rightHand,
    },
  };
}

function makeDeck({
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

const single = { totalCards: 30, totalEnergy: 100, totalAttack: 50 };
const double = { totalCards: 60, totalEnergy: 200, totalAttack: 100 };

const Riposo: Card = {
  title: "Riposo",
  description: "",
  attack: 0,
  defense: 0,
  color: "#71717A",
};

const Colpo: Card = {
  title: "Colpo",
  description: "",
  attack: 5,
  defense: 0,
  color: "#9F1239",
};

const Parata: Card = {
  title: "Parata",
  description: "",
  attack: 0,
  defense: 5,
  color: "#3B82F6",
};

const Spada = makeDeck(single)([
  ...repeat(Colpo, 10),
  ...repeat(Parata, 10),
  ...repeat(Riposo, 10),
]);

const Accettata: Card = {
  title: "Accettata",
  description: "",
  attack: 10,
  defense: 0,
  color: "#9F1239",
};

const Ascia = makeDeck(single)([
  ...repeat(Accettata, 10),
  ...repeat(Riposo, 20),
]);

const Pugnalata: Card = {
  title: "Pugnalata",
  description: "",
  attack: 3,
  defense: 0,
  color: "#9F1239",
};

const Intercetta: Card = {
  title: "Intercetta",
  description: "",
  attack: 0,
  defense: 3,
  color: "#3B82F6",
};

const Zaccagnata: Card = {
  title: "Zaccagnata",
  description: "",
  attack: 8,
  defense: 0,
  color: "#9F1239",
};

const Pugnale = makeDeck(single)([
  ...repeat(Pugnalata, 14),
  ...repeat(Intercetta, 14),
  ...repeat(Zaccagnata, 2),
]);

const Mazzata: Card = {
  title: "Mazzata",
  description: "",
  attack: 7,
  defense: 0,
  color: "#9F1239",
};

const Mazza = makeDeck(single)([
  ...repeat(Mazzata, 10),
  ...repeat(Intercetta, 10),
  ...repeat(Riposo, 10),
]);

const Martellata: Card = {
  title: "Martellata",
  description: "",
  attack: 15,
  defense: 0,
  color: "#9F1239",
};

const Scure = makeDeck(double)([
  ...repeat(Martellata, 11),
  ...repeat(Parata, 7),
  ...repeat(Riposo, 42),
]);

const Martello = makeDeck(double)([
  ...repeat(Martellata, 7),
  ...repeat(Parata, 19),
  ...repeat(Riposo, 34),
]);

const Schivata: Card = {
  title: "Schivata",
  description: "",
  attack: 0,
  defense: 10,
  color: "#3B82F6",
};

const Bastonata: Card = {
  title: "Bastonata",
  description: "",
  attack: 5,
  defense: 5,
  color: "#9F1239",
};

const Bastone = makeDeck(double)([
  ...repeat(Colpo, 10),
  ...repeat(Bastonata, 10),
  ...repeat(Schivata, 5),
  ...repeat(Riposo, 35),
]);

const Spadone = makeDeck(double)([
  ...repeat(Martellata, 5),
  ...repeat(Bastonata, 10),
  ...repeat(Colpo, 5),
  ...repeat(Riposo, 40),
]);

const Katana = makeDeck(double)([
  ...repeat(Martellata, 7),
  ...repeat(Bastonata, 2),
  ...repeat(Colpo, 15),
  ...repeat(Riposo, 36),
]);

const Lancia = makeDeck(double)([
  ...repeat(Bastonata, 2),
  ...repeat(Accettata, 9),
  ...repeat(Parata, 14),
  ...repeat(Schivata, 2),
  ...repeat(Riposo, 33),
]);

const Freccia: Card = {
  title: "Freccia",
  description: "",
  attack: 5,
  defense: 0,
  color: "#9F1239",
};

const Arco = makeDeck(double)([...repeat(Freccia, 40), ...repeat(Riposo, 20)]);

const Dardo: Card = {
  title: "Dardo",
  description: "",
  attack: 15,
  defense: 0,
  color: "#9F1239",
};

const Balestra = makeDeck(double)([
  ...repeat(Dardo, 13),
  Parata,
  ...repeat(Riposo, 46),
]);

const singleDecks = {
  Spada,
  Pugnale,
  Mazza,
  Ascia,
};

const doubleDecks = {
  Scure,
  Martello,
  Bastone,
  Arco,
  Balestra,
  Spadone,
  Katana,
  Lancia,
};

function randomDoubleDeck() {
  const deckNames = Object.keys(doubleDecks);
  const deckName = deckNames[rng(deckNames.length)] as keyof typeof doubleDecks;
  return [deckName, doubleDecks[deckName]] as const;
}

function randomDualDeck() {
  const deckNames = Object.keys(singleDecks);
  const leftDeckName = deckNames.splice(
    rng(deckNames.length),
    1
  )[0] as keyof typeof singleDecks;
  const rightDeckName = deckNames.splice(
    rng(deckNames.length),
    1
  )[0] as keyof typeof singleDecks;
  const deckName = leftDeckName + " & " + rightDeckName;
  const deck = [...singleDecks[leftDeckName], ...singleDecks[rightDeckName]];
  return [deckName, deck] as const;
}

function randomDeck() {
  if (Math.random() > 0.5) return randomDoubleDeck();
  else return randomDualDeck();
}

function repeat<T>(item: T, times: number): Array<T> {
  return new Array(times).fill(item);
}

function rng(to: number): number {
  return Math.trunc(Math.random() * to);
}

function drawCard(deck: Array<Card>): [Card, Array<Card>] {
  const cardIndex = rng(deck.length);
  const newDeck = [...deck];
  const card = newDeck.splice(cardIndex, 1)[0] ?? Riposo;
  return [card, newDeck];
}

function drawCards(
  deck: Array<Card>,
  times: number
): [Array<Card>, Array<Card>] {
  const newDeck = [...deck];
  const hand = [];
  for (let i = 0; i < times; i++) {
    const cardIndex = rng(newDeck.length);
    const card = newDeck.splice(cardIndex, 1)[0];
    hand.push(card);
  }
  return [hand, newDeck];
}

function removeCard(cardIndex: number, deck: Array<Card>): [Card, Array<Card>] {
  const newDeck = [...deck];
  const card = newDeck.splice(cardIndex, 1)[0];
  return [card, newDeck];
}

function getFightState(fight: Fight) {
  if (fight.left.hp <= 0) return "lose";
  if (fight.right.hp <= 0) return "win";
  return "tie";
}
