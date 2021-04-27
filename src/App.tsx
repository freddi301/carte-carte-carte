import React, { useState } from "react";
import { css } from "styled-components/macro";

export default function App() {
  const [fight, setFight] = useState(
    startFight({ hp: 30, deck: fighterDeck }, { hp: 30, deck: fighterDeck })
  );
  const fightState = getFightState(fight);
  switch (fightState) {
    case "lose":
      return (
        <div
          css={css`
            width: 100vw;
            height: 100vh;
            color: #be123c;
            background-color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <h1>GAME OVER ☠</h1>
        </div>
      );
    case "win":
      return (
        <div
          css={css`
            width: 100vw;
            height: 100vh;
            color: #0ea5e9;
            background-color: #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <h1>VICTORY 🖕</h1>
        </div>
      );
    case "tie": {
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
              <h1>Player</h1>
              <p>hp: {fight.left.hp}</p>
              <p>remaining cards: {fight.left.deck.length}</p>
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
                    onPlay={() => setFight(playCard(index, fight))}
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
              <h1>Mostro</h1>
              <p>hp: {fight.right.hp}</p>
            </div>
            <Card card={fight.right.hand} />
          </div>
        </div>
      );
    }
  }
}

// function Character({ character }: { character: Character }) {
//   return (
//     <div>
//       <h1>{character.name}</h1>
//       <p>hp: {character.hp}</p>
//     </div>
//   );
// }

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
          transform: scale(1.3);
        }
      `}
      onClick={onPlay}
    >
      <h2>{card.title}</h2>
      <p>attack: {card.attack}</p>
      <p>defense: {card.defense}</p>
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
  const leftCard = fight.left.hand[cardIndex];
  const rightCard = fight.right.hand;
  const leftDamage = Math.max(0, rightCard.attack - leftCard.defense);
  const rightDamage = Math.max(0, leftCard.attack - rightCard.defense);
  const [rightHand, rightDeck] = drawCard(fight.right.deck);
  const [newLeftCard, newLeftDeck] = drawCard(fight.left.deck);
  const leftHand = [...removeCard(cardIndex, fight.left.hand), newLeftCard];
  return {
    round: fight.round + 1,
    left: {
      hp: fight.left.hp - leftDamage,
      deck: newLeftDeck,
      hand: leftHand,
    },
    right: {
      hp: fight.right.hp - rightDamage,
      deck: rightDeck,
      hand: rightHand,
    },
  };
}

const Spadata: Card = {
  title: "Spadata",
  description: "",
  attack: 5,
  defense: 1,
  color: "#9F1239",
};

const Parata: Card = {
  title: "Parata",
  description: "",
  attack: 1,
  defense: 5,
  color: "#3B82F6",
};

const Riposo: Card = {
  title: "Riposo",
  description: "",
  attack: 0,
  defense: 1,
  color: "#71717A",
};

const DoppiaParata = {
  title: "Doppia Parata",
  description: "",
  attack: 0,
  defense: 9,
  color: "#3B82F6",
};

const DoppiaSpadata = {
  title: "Doppia Spadata",
  description: "",
  attack: 8,
  defense: 2,
  color: "#9F1239",
};

const Zaccagnata = {
  title: "Zaccagnata",
  description: "",
  attack: 3,
  defense: 3,
  color: "#A855F7",
};

const fighterDeck: Array<Card> = [
  ...repeat(Spadata, 10),
  ...repeat(Parata, 10),
  ...repeat(Riposo, 10),
  ...repeat(DoppiaParata, 2),
  ...repeat(DoppiaSpadata, 2),
  ...repeat(Zaccagnata, 2),
];

function repeat<T>(item: T, times: number): Array<T> {
  return new Array(times).fill(item);
}

function rng(to: number): number {
  return Math.trunc(Math.random() * to);
}

function drawCard(deck: Array<Card>): [Card, Array<Card>] {
  const cardIndex = rng(deck.length);
  const newDeck = [...deck];
  const card = newDeck.splice(cardIndex, 1)[0];
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

function removeCard(cardIndex: number, deck: Array<Card>) {
  const newDeck = [...deck];
  newDeck.splice(cardIndex, 1);
  return newDeck;
}

function getFightState(fight: Fight) {
  if (fight.left.hp <= 0) return "lose";
  if (fight.right.hp <= 0) return "win";
  return "tie";
}
