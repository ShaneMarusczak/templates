/** @jsx h */
import { h } from "preact";

export default function GameLink() {
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
  return (
    <p
      onClick={gotoGame}
      id="gameLink"
    >
      wanna play a game?
    </p>
  );
}
