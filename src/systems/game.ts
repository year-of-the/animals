import { Renderer } from "../engine/renderer";
import { startGameLoop } from "../engine/gameloop";
import { isKeyPressed } from "../engine/input";
import { MapSystem, Chunk, Tile } from "./map";
import { Sprite, SpriteSheet, Animation } from "./sprites";

const TILE_SIZE = 48;
const VIEWPORT_WIDTH = 16;
const VIEWPORT_HEIGHT = 12;

// Simple chunk loader: generates grass and wall border
function generateChunk(x: number, y: number): Chunk {
  const tiles: Tile[][] = [];
  for (let row = 0; row < 16; row++) {
    const r: Tile[] = [];
    for (let col = 0; col < 16; col++) {
      const isBorder = row === 0 || col === 0 || row === 15 || col === 15;
      r.push({ walkable: !isBorder, type: isBorder ? "wall" : "grass" });
    }
    tiles.push(r);
  }
  return { x, y, tiles };
}

export function startGame(canvas: HTMLCanvasElement) {
  const renderer = new Renderer(canvas);
  const map = new MapSystem(generateChunk);

  // Load initial visible chunks
  for (let cx = -1; cx <= 1; cx++) {
    for (let cy = -1; cy <= 1; cy++) {
      map.loadChunk(cx, cy);
    }
  }

  // Placeholder player sprite (single frame, no image)
  const playerSpriteSheet = new SpriteSheet("");
  playerSpriteSheet.loaded = true; // No image, so always loaded
  const playerSprite = new Sprite(
    playerSpriteSheet,
    [{ name: "idle", frames: [{ sx: 0, sy: 0, sw: TILE_SIZE, sh: TILE_SIZE }], frameRate: 1 }],
    "idle"
  );

  let playerX = 8, playerY = 8;
  let moveCooldown = 0;

  function update(dt: number) {
    playerSprite.update(dt);
    moveCooldown -= dt;
    if (moveCooldown <= 0) {
      let dx = 0, dy = 0;
      if (isKeyPressed("w") || isKeyPressed("arrowup")) dy = -1;
      else if (isKeyPressed("s") || isKeyPressed("arrowdown")) dy = 1;
      else if (isKeyPressed("a") || isKeyPressed("arrowleft")) dx = -1;
      else if (isKeyPressed("d") || isKeyPressed("arrowright")) dx = 1;
      if ((dx !== 0 || dy !== 0) && map.isWalkable(playerX + dx, playerY + dy)) {
        playerX += dx;
        playerY += dy;
        moveCooldown = 0.15; // 150ms between moves
      }
    }
  }

  function render() {
    renderer.clear();
    // Center viewport on player
    const offsetX = playerX - Math.floor(VIEWPORT_WIDTH / 2);
    const offsetY = playerY - Math.floor(VIEWPORT_HEIGHT / 2);
    // Draw visible map
    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
      for (let x = 0; x < VIEWPORT_WIDTH; x++) {
        const gx = x + offsetX;
        const gy = y + offsetY;
        const tile = map.getTile(gx, gy);
        if (tile) {
          renderer.ctx.fillStyle = tile.type === "wall" ? "#444" : "#6c6";
          renderer.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
    // Draw player
    const px = (playerX - offsetX) * TILE_SIZE;
    const py = (playerY - offsetY) * TILE_SIZE;
    renderer.ctx.fillStyle = "#f44";
    renderer.ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    // If you want to use sprite: renderer.drawSprite(playerSprite.getFrame(), px, py, TILE_SIZE, TILE_SIZE);
  }

  startGameLoop({ update, render });
} 