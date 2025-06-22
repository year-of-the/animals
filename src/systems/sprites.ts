export type Animation = {
  name: string;
  frames: { sx: number; sy: number; sw: number; sh: number; }[];
  frameRate: number; // frames per second
};

export class SpriteSheet {
  image: HTMLImageElement;
  loaded: boolean = false;

  constructor(public src: string) {
    this.image = new window.Image();
    this.image.src = src;
    this.image.onload = () => { this.loaded = true; };
  }
}

export class Sprite {
  private currentFrameIdx = 0;
  private frameTimer = 0;
  private currentAnim: Animation;

  constructor(
    public sheet: SpriteSheet,
    public animations: Animation[],
    initialAnim: string
  ) {
    this.currentAnim = this.animations.find(a => a.name === initialAnim)!;
  }

  setAnimation(name: string) {
    if (this.currentAnim.name !== name) {
      this.currentAnim = this.animations.find(a => a.name === name)!;
      this.currentFrameIdx = 0;
      this.frameTimer = 0;
    }
  }

  update(dt: number) {
    this.frameTimer += dt;
    const frameDuration = 1 / this.currentAnim.frameRate;
    if (this.frameTimer >= frameDuration) {
      this.currentFrameIdx = (this.currentFrameIdx + 1) % this.currentAnim.frames.length;
      this.frameTimer -= frameDuration;
    }
  }

  getFrame() {
    return {
      image: this.sheet.image,
      ...this.currentAnim.frames[this.currentFrameIdx]
    };
  }
} 