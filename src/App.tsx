import React, { useState } from "react";
import { css } from "styled-components/macro";
import { AttackType, Card } from "./decks/common";
import { Spada } from "./decks/Spada";
import { Pugnale } from "./decks/Pugnale";
import { Mazza } from "./decks/Mazza";
import { Ascia } from "./decks/Ascia";
import { Stocco } from "./decks/Stocco";
import { Scure } from "./decks/Scure";
import { Martello } from "./decks/Martello";
import { Bastone } from "./decks/Bastone";
import { Arco } from "./decks/Arco";
import { Balestra } from "./decks/Balestra";
import { Spadone } from "./decks/Spadone";
import { Katana } from "./decks/Katana";
import { Lancia } from "./decks/Lancia";

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
        <FighterComponent state={world.fight.player} />
        <div
          css={css`
            display: flex;
          `}
        >
          {world.fight.player.hand.map((card, index) => {
            return (
              <div
                key={index}
                css={css`
                  margin: 4px;
                  transform: scale(${3 / world.fight.player.hand.length});
                `}
              >
                <CardComponent
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
                        setWorld(nextFight(world.floor + 1, world.player));
                        break;
                      }
                      case "lose": {
                        setWorld(startWorld());
                        break;
                      }
                    }
                  }}
                />
              </div>
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
        <FighterComponent state={world.fight.mob} />
        <CardComponent card={world.fight.mob.hand[0]} />
      </div>
    </div>
  );
}

function FighterComponent({ state }: { state: FighterState }) {
  return (
    <div
      css={css`
        padding: 40px;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: auto auto auto auto;
          grid-column-gap: 10px;
          width: 300px;
        `}
      >
        <Healthbar health={state.hp} />
        <Deck deck={state.deck} />
        <strong>{state.character.name}</strong>
        <EquipmentComponent equipment={state.character.equipment} />
      </div>
      <Bleeding bleeding={state.bleeding} />
      <Fracture fracture={state.fracture} />
    </div>
  );
}

function Healthbar({ health }: { health: number }) {
  return <div>❤️ {health}</div>;
}

function Deck({ deck }: { deck: Array<Card> }) {
  return <div>🂡 {deck.length}</div>;
}

function Bleeding({ bleeding }: { bleeding: Array<number> }) {
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <div>🩸({bleeding.length})</div>
      {bleeding.map((wound, index) => {
        return <div key={index}>{wound},</div>;
      })}
    </div>
  );
}

function Fracture({ fracture }: { fracture: Array<number> }) {
  return (
    <div
      css={css`
        display: flex;
      `}
    >
      <div>🦴({fracture.length})</div>
      {fracture.map((wound, index) => {
        return <div key={index}>{wound},</div>;
      })}
    </div>
  );
}

function EquipmentComponent({ equipment }: { equipment: Equipment }) {
  switch (equipment.type) {
    case "double":
      return <span>{equipment.both}</span>;
    case "dual":
      return (
        <span>
          {equipment.left} & {equipment.right}
        </span>
      );
  }
}

function CardComponent({ card, onPlay }: { card: Card; onPlay?(): void }) {
  return (
    <div
      css={css`
        width: 6.35cm;
        height: 8.89cm;
        border-radius: 0.5cm;
        padding: 1cm;
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
        `}
      >
        {card.attack > 0 && (
          <>
            ⚔ {card.attack} <AttackTypeComponent attackType={card.attackType} />
          </>
        )}
        <br />
        {card.defense > 0 && <>🛡️ {card.defense}</>}
      </p>
    </div>
  );
}

function AttackTypeComponent({ attackType }: { attackType: AttackType }) {
  switch (attackType) {
    case "slash":
    case "thrust":
      return <>🩸</>;
    case "impact":
      return <>🦴</>;
  }
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
  return nextFight(1, { name: "Player", hp: 80, equipment: randomEquipment() });
}

function nextFight(floor: number, player: Character): World {
  const mob: Character = {
    name: "Enemy",
    hp: 80 + 10 * floor,
    equipment: randomEquipment(),
  };
  return {
    type: "fight",
    floor: floor,
    player,
    fight: startFight(floor, player, mob),
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

type Fight = {
  round: number;
  player: FighterState;
  mob: FighterState;
};

type FighterState = {
  character: Character;
  hp: number;
  bleeding: Array<number>;
  fracture: Array<number>;
  deck: Array<Card>;
  hand: Array<Card>;
};

function startFight(floor: number, player: Character, mob: Character): Fight {
  const mobDeck = getDeckFromEquipment(mob.equipment);
  const [mobHand, mobDeck1] = draw(mobDeck, 1);
  const playerDeck = getDeckFromEquipment(player.equipment);
  const [playerHand, playerDeck1] = draw(playerDeck, 3 + Math.trunc(floor / 3));
  return {
    round: 0,
    player: {
      character: player,
      hp: player.hp,
      bleeding: [],
      fracture: [],
      deck: playerDeck1,
      hand: playerHand,
    },
    mob: {
      character: mob,
      hp: mob.hp,
      bleeding: [],
      fracture: [],
      deck: mobDeck1,
      hand: mobHand,
    },
  };
}

function playCard(cardIndex: number, fight: Fight): Fight {
  const [playerCard, playerHand1] = remove(cardIndex, fight.player.hand);
  const [[mobHand], mobDeck1] = draw(fight.mob.deck, 1);
  const [mobCard] = fight.mob.hand;
  const [playerBleedingDamage, playerBleeding1] = getBleedingDamage(
    fight.player.bleeding
  );
  const [playerFractureDamage, playerFracture1] = getFractureDamage(
    fight.player.fracture
  );
  const [mobBleedingDamage, mobBleeding1] = getBleedingDamage(
    fight.mob.bleeding
  );
  const [mobFractureDamage, mobFracture1] = getFractureDamage(
    fight.mob.fracture
  );
  const playerDamage = Math.max(
    0,
    mobCard.attack - mobFractureDamage - playerCard.defense
  );
  const mobDamage = Math.max(
    0,
    playerCard.attack - playerFractureDamage - mobCard.defense
  );
  const [playerCards2, playerDeck1] = draw(fight.player.deck, 2);
  const [playerRecycledCard, playerHand2] = remove(0, playerHand1);
  const playerHand3 = [...playerHand2, ...playerCards2];
  const playerDeck2 = [...playerDeck1, playerRecycledCard];
  return {
    round: fight.round + 1,
    player: {
      character: fight.player.character,
      hp: fight.player.hp - playerDamage - playerBleedingDamage,
      bleeding: [
        ...playerBleeding1,
        mobCard.attackType === "slash" || mobCard.attackType === "thrust"
          ? playerDamage
          : 0,
      ].filter(Boolean),
      fracture: [
        ...playerFracture1,
        mobCard.attackType === "impact" ? playerDamage : 0,
      ].filter(Boolean),
      deck: playerDeck2,
      hand: playerHand3,
    },
    mob: {
      character: fight.mob.character,
      hp: fight.mob.hp - mobDamage - mobBleedingDamage,
      bleeding: [
        ...mobBleeding1,
        playerCard.attackType === "slash" || playerCard.attackType === "thrust"
          ? mobDamage
          : 0,
      ].filter(Boolean),
      fracture: [
        ...mobFracture1,
        playerCard.attackType === "impact" ? mobDamage : 0,
      ].filter(Boolean),
      deck: mobDeck1,
      hand: [mobHand],
    },
  };
}

function getBleedingDamage(bleeding: Array<number>): [number, Array<number>] {
  const damage = bleeding.filter((wound) => wound > 0).length;
  const bleeding1 = bleeding
    .map((wound) => wound - 1)
    .filter((wound) => wound > 0);
  return [damage, bleeding1];
}

function getFractureDamage(farcture: Array<number>): [number, Array<number>] {
  const damage = farcture.filter((wound) => wound > 0).length;
  const farcture1 = farcture
    .map((wound) => wound - 1)
    .filter((wound) => wound > 0);
  return [damage, farcture1];
}

const singleDecks = {
  Spada: Spada,
  Pugnale: Pugnale,
  Mazza: Mazza,
  Ascia: Ascia,
  Stocco: Stocco,
};

const doubleDecks = {
  Scure: Scure,
  Martello: Martello,
  Bastone: Bastone,
  Arco: Arco,
  Balestra: Balestra,
  Spadone: Spadone,
  Katana: Katana,
  Lancia: Lancia,
};

export function repeat<T>(item: T, times: number): Array<T> {
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
