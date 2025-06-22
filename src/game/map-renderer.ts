import { Renderer } from "../engine/renderer";
import { MapSystem } from "./map";
import { Sprite } from "./sprite";
import { TILE_SIZE } from "../config";
import { gameState } from "./state";

export class MapRenderer {
    private tileSprite: Sprite;
    private VIEWPORT_WIDTH: number;
    private VIEWPORT_HEIGHT: number;

    constructor(private renderer: Renderer, private mapSystem: MapSystem) {
        this.tileSprite = new Sprite("/sprites/Grass.png", TILE_SIZE, TILE_SIZE, [{ name: "default", frames: [], frameRate: 1 }], "default");
        this.VIEWPORT_WIDTH = Math.ceil(renderer.width / TILE_SIZE) + 1;
        this.VIEWPORT_HEIGHT = Math.ceil(renderer.height / TILE_SIZE) + 1;
    }

    public render(): void {
        if (!this.tileSprite.loaded) return;

        const player = gameState.player;
        const offsetX = player.x - Math.floor(this.VIEWPORT_WIDTH / 2);
        const offsetY = player.y - Math.floor(this.VIEWPORT_HEIGHT / 2);

        for (let y = 0; y < this.VIEWPORT_HEIGHT; y++) {
            for (let x = 0; x < this.VIEWPORT_WIDTH; x++) {
                const mapX = x + offsetX;
                const mapY = y + offsetY;
                
                const tile = this.mapSystem.getTile(mapX, mapY);
                if (tile) {
                    const screenX = (x - (offsetX - Math.floor(offsetX))) * TILE_SIZE;
                    const screenY = (y - (offsetY - Math.floor(offsetY))) * TILE_SIZE;

                    if (tile.type === "grass") {
                        this.renderer.drawSprite(
                            {
                                image: this.tileSprite.image,
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