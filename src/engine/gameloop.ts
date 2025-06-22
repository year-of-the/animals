export type GameLoopCallbacks = {
  update: (dt: number) => void;
  render: () => void;
};

export function startGameLoop({ update, render }: GameLoopCallbacks) {
  let lastTime = performance.now();

  function loop(now: number) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
} 