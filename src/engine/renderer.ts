export type SpriteFrame = {
  image: HTMLImageElement;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
};

export class Renderer {
  public readonly ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawSprite(frame: SpriteFrame, dx: number, dy: number, dw: number, dh: number) {
    this.ctx.drawImage(
      frame.image,
      frame.sx, frame.sy, frame.sw, frame.sh,
      dx, dy, dw, dh
    );
  }
} 