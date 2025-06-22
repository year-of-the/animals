export type Direction = "down" | "up" | "left" | "right";

export interface PlayerState {
    x: number;
    y: number;
    direction: Direction;
}

export interface GameState {
    player: PlayerState;
}

export const gameState: GameState = {
    player: {
        x: 8,
        y: 8,
        direction: "down",
    },
}; 