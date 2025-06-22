import { Renderer } from "../engine/renderer";
import { TILE_SIZE } from "../config";
import { gameState } from "./state";
import { Player } from "./player";

export class PlayerRenderer {
    constructor(private renderer: Renderer, private player: Player) {}

    public render(): void {
        if (!this.player.sprite.loaded) return;

        const frame = this.player.sprite.getCurrentFrame();
        const screenX = this.renderer.width / 2 - frame.sw / 2;
        const screenY = this.renderer.height / 2 - frame.sh / 2;

        this.renderer.drawSprite(frame, screenX, screenY, frame.sw, frame.sh);
    }
} 