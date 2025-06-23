import { gameState } from "./state";

export class Camera {
  public x: number;
  public y: number;

  constructor() {
    this.x = gameState.player.x;
    this.y = gameState.player.y;
  }

  public update(dt: number): void {
    const interpolationFactor = 15;
    this.x += (gameState.player.x - this.x) * interpolationFactor * dt;
    this.y += (gameState.player.y - this.y) * interpolationFactor * dt;
  }
} 