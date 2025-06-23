export type Direction = "down" | "up" | "left" | "right";

export interface PlayerState {
  x: number;
  y: number;
  direction: Direction;
}

export interface GameState {
  player: PlayerState;
}

const defaultGameState: GameState = {
  player: {
    x: 8,
    y: 8,
    direction: "down",
  },
};

export const gameState: GameState = JSON.parse(localStorage.getItem("state") || JSON.stringify(defaultGameState));

export const storeState = () => {
  localStorage.setItem("state", JSON.stringify(gameState));
}