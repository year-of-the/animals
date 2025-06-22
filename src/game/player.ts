import { Sprite } from "./sprite";
import { PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT } from "../config";
import { isKeyPressed } from "../engine/input";
import { gameState, Direction } from "./state";
import { MapSystem } from "./map";

const frame = (index: number, cols = 5) => ({
    sx: (index % cols) * PLAYER_SPRITE_WIDTH,
    sy: Math.floor(index / cols) * PLAYER_SPRITE_HEIGHT,
});

const playerAnimations = [
  { name: "idle-down",  frames: [frame(0)], frameRate: 1 },
  { name: "idle-right", frames: [frame(3)], frameRate: 1 },
  { name: "idle-left",  frames: [frame(6)], frameRate: 1 },
  { name: "idle-up",    frames: [frame(9)], frameRate: 1 },
  { name: "walk-down",  frames: [frame(1), frame(0), frame(2), frame(0)], frameRate: 6 },
  { name: "walk-right", frames: [frame(4), frame(3), frame(5), frame(3)], frameRate: 6 },
  { name: "walk-left",  frames: [frame(7), frame(6), frame(8), frame(6)], frameRate: 6 },
  { name: "walk-up",    frames: [frame(10), frame(9), frame(11), frame(9)], frameRate: 6 },
];

export class Player {
    public sprite: Sprite;
    private moveCooldown: number = 0;
    
    constructor(private mapSystem: MapSystem) {
        this.sprite = new Sprite(
            "/sprites/Character.png",
            PLAYER_SPRITE_WIDTH,
            PLAYER_SPRITE_HEIGHT,
            playerAnimations,
            "idle-down"
        );
    }

    update(dt: number) {
        this.moveCooldown -= dt;

        let dx = 0;
        let dy = 0;
        let direction: Direction = gameState.player.direction;

        if (isKeyPressed("w") || isKeyPressed("arrowup")) { dy = -1; direction = "up"; }
        else if (isKeyPressed("s") || isKeyPressed("arrowdown")) { dy = 1; direction = "down"; }
        else if (isKeyPressed("a") || isKeyPressed("arrowleft")) { dx = -1; direction = "left"; }
        else if (isKeyPressed("d") || isKeyPressed("arrowright")) { dx = 1; direction = "right"; }
        
        gameState.player.direction = direction;

        const isTryingToMove = dx !== 0 || dy !== 0;

        if (isTryingToMove && this.moveCooldown <= 0) {
            const targetX = gameState.player.x + dx;
            const targetY = gameState.player.y + dy;

            if (this.mapSystem.isWalkable(targetX, targetY)) {
                gameState.player.x = targetX;
                gameState.player.y = targetY;
                this.moveCooldown = 0.2;
            }
        }
        
        this.sprite.setAnimation(isTryingToMove ? `walk-${direction}` : `idle-${direction}`);
        this.sprite.update(dt);
    }
} 