export interface Animation {
  name: string;
  frames: { sx: number; sy: number; }[];
  frameRate: number;
}

export class Sprite {
  public image: HTMLImageElement;
  public loaded: boolean = false;
  private animations: Map<string, Animation>;
  private currentAnimation: Animation;
  private currentFrameIndex: number = 0;
  private frameTimer: number = 0;

  constructor(
    src: string,
    public frameWidth: number,
    public frameHeight: number,
    animations: Animation[],
    initialAnimName: string
  ) {
    this.image = new window.Image();
    this.image.src = src;
    this.image.onload = () => { this.loaded = true; };
    
    this.animations = new Map(animations.map(a => [a.name, a]));
    
    const initialAnim = this.animations.get(initialAnimName);
    if (!initialAnim) {
      throw new Error(`Animation "${initialAnimName}" not found.`);
    }
    this.currentAnimation = initialAnim;
  }

  public setAnimation(name: string): void {
    const newAnim = this.animations.get(name);
    if (newAnim && this.currentAnimation.name !== name) {
      this.currentAnimation = newAnim;
      this.currentFrameIndex = 0;
      this.frameTimer = 0;
    }
  }

  public update(dt: number): void {
    this.frameTimer += dt;
    const frameDuration = 1 / this.currentAnimation.frameRate;
    if (this.frameTimer > frameDuration) {
      this.currentFrameIndex = (this.currentFrameIndex + 1) % this.currentAnimation.frames.length;
      this.frameTimer -= frameDuration;
    }
  }

  public getCurrentFrame() {
    const frame = this.currentAnimation.frames[this.currentFrameIndex];
    return {
      image: this.image,
      sx: frame.sx,
      sy: frame.sy,
      sw: this.frameWidth,
      sh: this.frameHeight,
    };
  }
} 