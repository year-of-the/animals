import { Chunk, Tile } from "./map";
import { CHUNK_SIZE } from "../config";

export function generateChunk(chunkX: number, chunkY: number): Chunk {
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