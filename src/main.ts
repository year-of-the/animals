import { startGameLoop } from "./engine/gameloop";
import { Renderer } from "./engine/renderer";
import { CHUNK_SIZE, TILE_SIZE } from "./config";
import { MapSystem, Chunk, Tile } from "./game/map";
import { MapRenderer } from "./game/map-renderer";
import { Player } from "./game/player";
import { PlayerRenderer } from "./game/player-renderer";

function generateChunk(chunkX: number, chunkY: number): Chunk {
    const tiles: Tile[][] = [];
    for (let y = 0; y < CHUNK_SIZE; y++) {
        const row: Tile[] = [];
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const isBorder = x === 0 || y === 0 || x === CHUNK_SIZE - 1 || y === CHUNK_SIZE - 1;
            row.push({
                walkable: !isBorder,
                type: isBorder ? "wall" : "grass",
                variant: isBorder ? 0 : (x * 7 + y * 13) % 4,
            });
        }
        tiles.push(row);
    }
    return { x: chunkX, y: chunkY, tiles };
}

function main() {
    const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    canvas.width = 16 * TILE_SIZE;
    canvas.height = 12 * TILE_SIZE;

    const renderer = new Renderer(canvas);
    
    const mapSystem = new MapSystem(generateChunk);
    mapSystem.loadChunk(0, 0);
    mapSystem.loadChunk(1, 0);
    mapSystem.loadChunk(-1, 0);
    mapSystem.loadChunk(0, 1);
    mapSystem.loadChunk(0, -1);

    const player = new Player(mapSystem);
    const mapRenderer = new MapRenderer(renderer, mapSystem);
    const playerRenderer = new PlayerRenderer(renderer, player);

    startGameLoop({
        update: (dt) => {
            player.update(dt);
        },
        render: () => {
            renderer.clear();
            mapRenderer.render();
            playerRenderer.render();
        },
    });
}

main();
