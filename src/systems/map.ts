export type Tile = {
  walkable: boolean;
  type: string;
};

export type Chunk = {
  x: number;
  y: number;
  tiles: Tile[][];
};

const CHUNK_SIZE = 16;

export class MapSystem {
  private loadedChunks: Map<string, Chunk> = new Map();

  constructor(private chunkLoader: (x: number, y: number) => Chunk) {}

  getChunkKey(x: number, y: number) {
    return `${x},${y}`;
  }

  loadChunk(x: number, y: number) {
    const key = this.getChunkKey(x, y);
    if (!this.loadedChunks.has(key)) {
      const chunk = this.chunkLoader(x, y);
      this.loadedChunks.set(key, chunk);
    }
  }

  unloadChunk(x: number, y: number) {
    const key = this.getChunkKey(x, y);
    this.loadedChunks.delete(key);
  }

  getTile(globalX: number, globalY: number): Tile | null {
    const chunkX = Math.floor(globalX / CHUNK_SIZE);
    const chunkY = Math.floor(globalY / CHUNK_SIZE);
    const key = this.getChunkKey(chunkX, chunkY);
    const chunk = this.loadedChunks.get(key);
    if (!chunk) return null;
    const localX = globalX % CHUNK_SIZE;
    const localY = globalY % CHUNK_SIZE;
    return chunk.tiles[localY]?.[localX] || null;
  }

  isWalkable(globalX: number, globalY: number): boolean {
    const tile = this.getTile(globalX, globalY);
    return tile ? tile.walkable : false;
  }
} 