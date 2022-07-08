/** @jsx h */
import { h } from "preact";

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const games = [
  "Battleship-JS",
  "Space-Invaders",
  "Connect-Four-MinMax",
  "Sudoku-Game",
  "Tetris",
  "Concentration",
  "Minesweeper",
];

function gameLink() {
  return "https://marusczak.com/" +
    games[randomIntFromInterval(0, games.length - 1)];
}

function gotoGame() {
  window.open(gameLink(), "_blank");
}

export default function GameLink() {
  return (
    <p
      onClick={() => gotoGame()}
      style={{
        position: "absolute",
        top: "7vh",
        left: "13vw",
        cursor: "pointer",
      }}
    >
      wanna play a game?
    </p>
  );
}
