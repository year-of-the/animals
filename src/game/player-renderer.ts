import { Renderer } from "../engine/renderer";
import { Player } from "./player";
import { Camera } from "./camera";
import { TILE_SIZE } from "../config";

export class PlayerRenderer {
  constructor(
    private renderer: Renderer, 
    private player: Player,
    private camera: Camera
  ) {}

  public render(): void {
    if (!this.player.sprite.loaded) return;

    const frame = this.player.sprite.getCurrentFrame();
    const visualPos = this.player.getVisualPosition();

    const offsetX = this.camera.x - Math.floor(this.renderer.width / TILE_SIZE / 2);
    const offsetY = this.camera.y - Math.floor(this.renderer.height / TILE_SIZE / 2);
    
    const screenX = (visualPos.x - offsetX) * TILE_SIZE;
    const screenY = (visualPos.y - offsetY) * TILE_SIZE;

    this.renderer.drawSprite(frame, screenX, screenY, frame.sw, frame.sh);
  }
} 