import { Sprite } from "./sprite";
import { PLAYER_SPRITE_WIDTH, PLAYER_SPRITE_HEIGHT } from "../config";
import { isKeyPressed } from "../engine/input";
import { gameState } from "./state";
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
  { name: "walk-down",  frames: [frame(1), frame(0), frame(2), frame(0)], frameRate: 8 },
  { name: "walk-right", frames: [frame(4), frame(3), frame(5), frame(3)], frameRate: 8 },
  { name: "walk-left",  frames: [frame(7), frame(6), frame(8), frame(6)], frameRate: 8 },
  { name: "walk-up",    frames: [frame(10), frame(9), frame(11), frame(9)], frameRate: 8 },
];

function lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
}

export class Player {
    public sprite: Sprite;
    
    private isMoving: boolean = false;
    private moveProgress: number = 0;
    private fromX: number;
    private fromY: number;
    private readonly MOVE_SPEED = 4.5; // Tiles per second

    constructor(private mapSystem: MapSystem) {
        this.sprite = new Sprite(
            "/sprites/Character.png",
            PLAYER_SPRITE_WIDTH,
            PLAYER_SPRITE_HEIGHT,
            playerAnimations,
            "idle-down"
        );
        this.fromX = gameState.player.x;
        this.fromY = gameState.player.y;
    }

    public getVisualPosition(): { x: number; y: number } {
        if (!this.isMoving) {
            return { x: gameState.player.x, y: gameState.player.y };
        }
        return {
            x: lerp(this.fromX, gameState.player.x, this.moveProgress),
            y: lerp(this.fromY, gameState.player.y, this.moveProgress),
        };
    }

    public update(dt: number): void {
        if (this.isMoving) {
            this.moveProgress += dt * this.MOVE_SPEED;
            if (this.moveProgress >= 1) {
                this.isMoving = false;
                this.fromX = gameState.player.x;
                this.fromY = gameState.player.y;
            }
        } else {
            this.handleInput();
        }
        
        const direction = gameState.player.direction;
        this.sprite.setAnimation(this.isMoving ? `walk-${direction}` : `idle-${direction}`);
        this.sprite.update(dt);
    }

    private handleInput(): void {
        let dx = 0;
        let dy = 0;

        if (isKeyPressed("w") || isKeyPressed("arrowup")) { dy = -1; gameState.player.direction = "up"; }
        else if (isKeyPressed("s") || isKeyPressed("arrowdown")) { dy = 1; gameState.player.direction = "down"; }
        else if (isKeyPressed("a") || isKeyPressed("arrowleft")) { dx = -1; gameState.player.direction = "left"; }
        else if (isKeyPressed("d") || isKeyPressed("arrowright")) { dx = 1; gameState.player.direction = "right"; }

        if (dx !== 0 || dy !== 0) {
            this.move(dx, dy);
        }
    }

    private move(dx: number, dy: number): void {
        const targetX = gameState.player.x + dx;
        const targetY = gameState.player.y + dy;

        if (this.mapSystem.isWalkable(targetX, targetY)) {
            this.fromX = gameState.player.x;
            this.fromY = gameState.player.y;
            gameState.player.x = targetX;
            gameState.player.y = targetY;
            this.isMoving = true;
            this.moveProgress = 0;
        }
    }
} 