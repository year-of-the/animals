export interface Animation {
  name: string;
  frames: { sx: number; sy: number; }[];
  frameRate: number;
}

interface AnimationState {
  frameIndex: number;
  frameTimer: number;
}

export class Sprite {
  public image: HTMLImageElement;
  public loaded: boolean = false;
  private animations: Map<string, Animation>;
  private currentAnimation: Animation;
  private animationStates: Map<string, AnimationState>;

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
    this.animationStates = new Map();
    for (const anim of animations) {
        this.animationStates.set(anim.name, { frameIndex: 0, frameTimer: 0 });
    }
    
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
        // Reset idle animations so they always start from the beginning
        if (name.startsWith("idle-")) {
            const state = this.animationStates.get(name)!;
            state.frameIndex = 0;
            state.frameTimer = 0;
        }
    }
  }

  public update(dt: number): void {
    const state = this.animationStates.get(this.currentAnimation.name)!;
    
    state.frameTimer += dt;
    const frameDuration = 1 / this.currentAnimation.frameRate;
    if (state.frameTimer > frameDuration) {
      state.frameIndex = (state.frameIndex + 1) % this.currentAnimation.frames.length;
      state.frameTimer -= frameDuration;
    }
  }

  public getCurrentFrame() {
    const state = this.animationStates.get(this.currentAnimation.name)!;
    const frame = this.currentAnimation.frames[state.frameIndex];
    return {
      image: this.image,
      sx: frame.sx,
      sy: frame.sy,
      sw: this.frameWidth,
      sh: this.frameHeight,
    };
  }
} 