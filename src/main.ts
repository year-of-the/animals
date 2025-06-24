import { startGameLoop } from "./engine/gameloop";
import { Renderer } from "./engine/renderer";
import { TILE_SIZE } from "./config";
import { MapSystem } from "./game/map";
import { MapRenderer } from "./game/map-renderer";
import { Player } from "./game/player";
import { PlayerRenderer } from "./game/player-renderer";
import { storeState } from "./game/state";
import { generateChunk } from "./game/world-generator";
import { Camera } from "./game/camera";

function main() {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  canvas.width = 16 * TILE_SIZE;
  canvas.height = 12 * TILE_SIZE;

  const renderer = new Renderer(canvas);
  
  const mapSystem = new MapSystem(generateChunk);
  for (let y = -1; y <= 1; y++) {
    for (let x = -1; x <= 1; x++) {
      mapSystem.loadChunk(x, y);
    }
  }

  const player = new Player(mapSystem);
  const camera = new Camera(player);
  const mapRenderer = new MapRenderer(renderer, mapSystem, camera);
  const playerRenderer = new PlayerRenderer(renderer, player, camera);

  setInterval(storeState, 5000);
  window.addEventListener("beforeunload", storeState);

  startGameLoop({
    update: (dt) => {
      player.update(dt);
      camera.update(dt);
    },
    render: () => {
      renderer.clear();
      mapRenderer.render();
      playerRenderer.render();
    },
  });
}

main();
