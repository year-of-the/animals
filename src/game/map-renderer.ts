import { Renderer } from "../engine/renderer";
import { MapSystem } from "./map";
import { TILE_SIZE } from "../config";
import { Camera } from "./camera";

export class MapRenderer {
  private tilesheet: HTMLImageElement;
  private tilesheetLoaded: boolean = false;
  private readonly VIEWPORT_WIDTH: number;
  private readonly VIEWPORT_HEIGHT: number;

  constructor(
    private renderer: Renderer, 
    private mapSystem: MapSystem,
    private camera: Camera
  ) {
    this.tilesheet = new window.Image();
    this.tilesheet.src = "/sprites/Grass.png";
    this.tilesheet.onload = () => { this.tilesheetLoaded = true; };
    
    this.VIEWPORT_WIDTH = Math.ceil(renderer.width / TILE_SIZE) + 1;
    this.VIEWPORT_HEIGHT = Math.ceil(renderer.height / TILE_SIZE) + 1;
  }

  public render(): void {
    if (!this.tilesheetLoaded) return;

    const offsetX = this.camera.x - Math.floor(this.VIEWPORT_WIDTH / 2);
    const offsetY = this.camera.y - Math.floor(this.VIEWPORT_HEIGHT / 2);

    for (let y = 0; y < this.VIEWPORT_HEIGHT; y++) {
      for (let x = 0; x < this.VIEWPORT_WIDTH; x++) {
        const mapX = Math.floor(x + offsetX);
        const mapY = Math.floor(y + offsetY);
        
        const tile = this.mapSystem.getTile(mapX, mapY);
        if (tile) {
          const screenX = (x - (offsetX - Math.floor(offsetX))) * TILE_SIZE;
          const screenY = (y - (offsetY - Math.floor(offsetY))) * TILE_SIZE;

          if (tile.type === "grass") {
            this.renderer.drawSprite(
              {
                image: this.tilesheet,
                sx: tile.variant * TILE_SIZE,
                sy: 0,
                sw: TILE_SIZE,
                sh: TILE_SIZE
              },
              screenX, screenY, TILE_SIZE, TILE_SIZE
            );
          } else if (tile.type === "wall") {
            this.renderer.ctx.fillStyle = "#333";
            this.renderer.ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }
  }
} 