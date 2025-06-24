import { Player } from "./player";

export class Camera {
  public x: number;
  public y: number;

  constructor(private player: Player) {
    const visualPos = this.player.getVisualPosition();
    this.x = visualPos.x;
    this.y = visualPos.y;
  }

  public update(dt: number): void {
    const visualPos = this.player.getVisualPosition();
    const interpolationFactor = 16;
    this.x += (visualPos.x - this.x) * interpolationFactor * dt;
    this.y += (visualPos.y - this.y) * interpolationFactor * dt;
  }
} 