import { CHUNK_SIZE } from "../config";

export interface Tile {
  walkable: boolean;
  type: string;
  variant: number;
}

export interface Chunk {
  x: number;
  y: number;
  tiles: Tile[][];
}

export class MapSystem {
  private loadedChunks: Map<string, Chunk> = new Map();

  constructor(private chunkLoader: (x: number, y: number) => Chunk) {}

  public getChunkKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  public loadChunk(x: number, y: number): void {
    const key = this.getChunkKey(x, y);
    if (!this.loadedChunks.has(key)) {
      const chunk = this.chunkLoader(x, y);
      this.loadedChunks.set(key, chunk);
    }
  }

  public getTile(globalX: number, globalY: number): Tile | null {
    const chunkX = Math.floor(globalX / CHUNK_SIZE);
    const chunkY = Math.floor(globalY / CHUNK_SIZE);
    const key = this.getChunkKey(chunkX, chunkY);
    const chunk = this.loadedChunks.get(key);
    if (!chunk) return null;

    const localX = globalX - chunkX * CHUNK_SIZE;
    const localY = globalY - chunkY * CHUNK_SIZE;
    return chunk.tiles[localY]?.[localX] || null;
  }

  public isWalkable(globalX: number, globalY: number): boolean {
    const tile = this.getTile(globalX, globalY);
    return tile ? tile.walkable : false;
  }
} 