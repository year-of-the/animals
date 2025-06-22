const keys: Record<string, boolean> = {};

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

export function isKeyPressed(key: string): boolean {
  return !!keys[key.toLowerCase()];
} 