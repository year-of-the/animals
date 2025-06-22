import { startGame } from "./systems/game";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
startGame(canvas);
