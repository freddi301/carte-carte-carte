import React, { useState } from "react";
import { css } from "styled-components/macro";

// strength (enhance : heavy attack, heavy defence)
// dexterity (enhance : light attack, light defence)
// intellignece (more powerful attack magic, more defensive magic)
// wisdom (more attack magic, more powerful defensive magic)

const music = [
  new Audio(process.env.PUBLIC_URL + "sound/music/bush-pass.mp3"),
  new Audio(process.env.PUBLIC_URL + "sound/music/cloudy-mood.mp3"),
  new Audio(process.env.PUBLIC_URL + "sound/music/promenade-vista.mp3"),
];
let song: HTMLAudioElement;

let toggleSound = playSound;

function playSound() {
  song = music[rng(music.length)];
  song.play();
  song.addEventListener("ended", function onEnded() {
    song.currentTime = 0;
    song.removeEventListener("ended", onEnded);
    playSound();
  });
  toggleSound = pauseSound;
}

function pauseSound() {
  if (song) {
    if (song.paused) {
      song.play();
    } else {
      song.pause();
    }
  }
}

export default function App() {
  const [world, setWorld] = useState(startWorld);
  const fightState = getFightState(world.fight);
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
        <h2>
          Floor: {world.floor} Round: {world.fight.round}
          <button onClick={() => toggleSound()}>♫</button>
        </h2>
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
          <h1>{world.fight.player.character.name}</h1>
          <Equipment equipment={world.fight.player.character.equipment} />
          <Healthbar health={world.fight.player.hp} />
          <Deck deck={world.fight.player.deck} />
        </div>
        <div
          css={css`
            display: flex;
          `}
        >
          {world.fight.player.hand.map((card, index) => {
            return (
              <Card
                key={index}
                card={card}
                onPlay={() => {
                  switch (fightState) {
                    case "tie": {
                      setWorld((world) => ({
                        ...world,
                        fight: playCard(index, world.fight),
                      }));
                      break;
                    }
                    case "win": {
                      setWorld(nextFight(world.floor, world.player));
                      break;
                    }
                    case "lose": {
                      setWorld(startWorld());
                      break;
                    }
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
          <h1>{world.fight.mob.character.name}</h1>
          <Equipment equipment={world.fight.mob.character.equipment} />
          <Healthbar health={world.fight.mob.hp} />
          <Deck deck={world.fight.mob.deck} />
        </div>
        <Card card={world.fight.mob.hand} />
      </div>
    </div>
  );
}

function Healthbar({ health }: { health: number }) {
  return (
    <div
      css={css`
        width: 40ch;
        word-break: break-all;
      `}
    >
      {"❤️".repeat(Math.max(0, health))}
    </div>
  );
}

function Deck({ deck }: { deck: Array<Card> }) {
  return (
    <div
      css={css`
        width: 40ch;
        word-break: break-all;
      `}
    >
      {"🂡".repeat(deck.length)}
    </div>
  );
}

function Equipment({ equipment }: { equipment: Equipment }) {
  switch (equipment.type) {
    case "double":
      return <h3>{equipment.both}</h3>;
    case "dual":
      return (
        <h3>
          {equipment.left} & {equipment.right}
        </h3>
      );
  }
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
        user-select: none;
      `}
      onClick={() => {
        onPlay?.();
        if (card.sound) {
          new Audio(
            process.env.PUBLIC_URL + "/sound/effects/" + card.sound + ".mp3"
          ).play();
        }
      }}
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

type Character = {
  name: string;
  hp: number;
  equipment: Equipment;
};

type Equipment =
  | {
      type: "dual";
      left: keyof typeof singleDecks;
      right: keyof typeof singleDecks;
    }
  | { type: "double"; both: keyof typeof doubleDecks };

type World = {
  floor: number;
  type: "fight";
  player: Character;
  fight: Fight;
};

function startWorld(): World {
  return nextFight(0, { name: "Player", hp: 80, equipment: randomEquipment() });
}

function nextFight(floor: number, player: Character): World {
  const mob: Character = {
    name: "Enemy",
    hp: 80,
    equipment: randomEquipment(),
  };
  return {
    type: "fight",
    floor: floor + 1,
    player,
    fight: startFight(player, mob),
  };
}

function randomEquipment(): Equipment {
  if (Math.random() > 0.5) {
    const [[both]] = draw(
      Object.keys(doubleDecks) as Array<keyof typeof doubleDecks>,
      1
    );
    return { type: "double", both };
  } else {
    const [[left, right]] = draw(
      Object.keys(singleDecks) as Array<keyof typeof singleDecks>,
      2
    );
    return { type: "dual", left, right };
  }
}

function getDeckFromEquipment(equipment: Equipment): Array<Card> {
  switch (equipment.type) {
    case "double": {
      return doubleDecks[equipment.both];
    }
    case "dual": {
      return [...singleDecks[equipment.left], ...singleDecks[equipment.right]];
    }
  }
}

type Card = {
  title: string;
  description: string;
  attack: number;
  defense: number;
  color: string;
  sound: string;
};

type Fight = {
  round: number;
  player: {
    character: Character;
    hp: number;
    deck: Array<Card>;
    hand: Array<Card>;
  };
  mob: {
    character: Character;
    hp: number;
    deck: Array<Card>;
    hand: Card;
  };
};

function startFight(player: Character, mob: Character): Fight {
  const mobDeck = getDeckFromEquipment(mob.equipment);
  const [[mobHand], mobDeck1] = draw(mobDeck, 1);
  const playerDeck = getDeckFromEquipment(player.equipment);
  const [playerHand, playerDeck1] = draw(playerDeck, 3);
  return {
    round: 0,
    player: {
      character: player,
      hp: player.hp,
      deck: playerDeck1,
      hand: playerHand,
    },
    mob: {
      character: mob,
      hp: mob.hp,
      deck: mobDeck1,
      hand: mobHand,
    },
  };
}

function playCard(cardIndex: number, fight: Fight): Fight {
  const [playerCard, playerHand1] = remove(cardIndex, fight.player.hand);
  const [[mobHand], mobDeck1] = draw(fight.mob.deck, 1);
  const mobCard = fight.mob.hand;
  const leftDamage = Math.max(0, mobCard.attack - playerCard.defense);
  const rightDamage = Math.max(0, playerCard.attack - mobCard.defense);
  const [playerCards2, playerDeck1] = draw(fight.player.deck, 2);
  const [leftRecycledCard, newLeftHand2] = remove(0, playerHand1);
  const newLeftHand3 = [...newLeftHand2, ...playerCards2];
  const newLeftDeck2 = [...playerDeck1, leftRecycledCard];
  return {
    round: fight.round + 1,
    player: {
      character: fight.player.character,
      hp: fight.player.hp - leftDamage,
      deck: newLeftDeck2,
      hand: newLeftHand3,
    },
    mob: {
      character: fight.mob.character,
      hp: fight.mob.hp - rightDamage,
      deck: mobDeck1,
      hand: mobHand,
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
  sound: "ha",
};

const Colpo: Card = {
  title: "Colpo",
  description: "",
  attack: 5,
  defense: 0,
  color: "#9F1239",
  sound: "bam",
};

const Parata: Card = {
  title: "Parata",
  description: "",
  attack: 0,
  defense: 5,
  color: "#3B82F6",
  sound: "he",
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
  sound: "bam",
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
  sound: "bam",
};

const Intercetta: Card = {
  title: "Intercetta",
  description: "",
  attack: 0,
  defense: 3,
  color: "#3B82F6",
  sound: "he",
};

const Zaccagnata: Card = {
  title: "Zaccagnata",
  description: "",
  attack: 8,
  defense: 0,
  color: "#9F1239",
  sound: "bam",
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
  sound: "bam",
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
  sound: "bam",
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
  sound: "he",
};

const Bastonata: Card = {
  title: "Bastonata",
  description: "",
  attack: 5,
  defense: 5,
  color: "#9F1239",
  sound: "bam",
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
  sound: "bam",
};

const Arco = makeDeck(double)([...repeat(Freccia, 40), ...repeat(Riposo, 20)]);

const Dardo: Card = {
  title: "Dardo",
  description: "",
  attack: 15,
  defense: 0,
  color: "#9F1239",
  sound: "bam",
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

function repeat<T>(item: T, times: number): Array<T> {
  return new Array(times).fill(item);
}

function rng(to: number): number {
  return Math.trunc(Math.random() * to);
}

function draw<T>(array: Array<T>, times: number): [Array<T>, Array<T>] {
  const newArray = [...array];
  const drawn = [];
  for (let i = 0; i < times; i++) {
    const index = rng(newArray.length);
    const item = newArray.splice(index, 1)[0];
    drawn.push(item);
  }
  return [drawn, newArray];
}

function remove<T>(index: number, array: Array<T>): [T, Array<T>] {
  const newDeck = [...array];
  const card = newDeck.splice(index, 1)[0];
  return [card, newDeck];
}

function getFightState(fight: Fight) {
  if (fight.player.hp <= 0) return "lose";
  if (fight.mob.hp <= 0) return "win";
  return "tie";
}
