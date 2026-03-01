import { hexToRGBA, Vector2 } from './utils';

const DEG_TO_RAD = Math.PI / 180;

export class ConfettiParticle {
  pos: Vector2;
  rotationSpeed: number;
  angle: number;
  rotation: number;
  cosA: number;
  size: number;
  oscillationSpeed: number;
  xSpeed: number;
  ySpeed: number;
  time: number;
  bounds: Vector2;
  color: string;
  fadeThreshold: number;
  corners: Vector2[];

  constructor(
    bounds: Vector2,
    offset: number,
    gravity: number,
    color: string,
    fadeThreshold: number,
    size: number = 5.0,
  ) {
    this.pos = new Vector2(Math.random() * bounds.x, Math.random() * bounds.y - offset * bounds.y);
    this.rotationSpeed = Math.random() * 200 + 800;
    this.angle = DEG_TO_RAD * Math.random() * 360;
    this.rotation = DEG_TO_RAD * Math.random() * 360;
    this.cosA = 1.0;
    this.size = size;
    this.oscillationSpeed = Math.random() * 1.5 + 0.5;
    this.xSpeed = 40.0;
    this.ySpeed = Math.random() * gravity * 60 + 50.0;
    this.time = Math.random();
    this.bounds = bounds;
    this.color = color;
    this.fadeThreshold = fadeThreshold;

    this.corners = [];
    for (let i = 0; i < 4; i += 1) {
      const x = Math.cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
      const y = Math.sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
      const corner = new Vector2(x, y);
      this.corners.push(corner);
    }
  }

  resetBounds(bounds: Vector2): void {
    this.bounds = bounds;
  }

  render(duration: number, context: CanvasRenderingContext2D, cullOutOfBounds: boolean): boolean {
    this.time += duration;
    this.rotation += this.rotationSpeed * duration;
    this.cosA = Math.cos(DEG_TO_RAD * this.rotation);

    this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * duration;
    this.pos.y += this.ySpeed * duration;

    if (this.pos.y > this.bounds.y) {
      if (cullOutOfBounds) {
        return false;
      }

      this.pos.x = Math.random() * this.bounds.x;
      this.pos.y = 0;
    }

    const startPosition = {
      x: (this.pos.x + this.corners[0].x * this.size) * window.devicePixelRatio,
      y: (this.pos.y + this.corners[0].y * this.size * this.cosA) * window.devicePixelRatio,
    };

    const calculateOpacity = (fadeThreshold: number, yPos: number, yMax: number): number => {
      if (fadeThreshold === 1 || yPos / yMax < fadeThreshold) {
        return 1;
      }
      return 1 + fadeThreshold - yPos / yMax;
    };

    const opacity = calculateOpacity(this.fadeThreshold, this.pos.y, this.bounds.y);
    context.fillStyle = hexToRGBA(this.color, opacity, this.cosA);
    context.beginPath();
    context.moveTo(startPosition.x, startPosition.y);

    this.corners.forEach((corner) => {
      const endPosition = {
        x: (this.pos.x + corner.x * this.size) * window.devicePixelRatio,
        y: (this.pos.y + corner.y * this.size * this.cosA) * window.devicePixelRatio,
      };

      context.lineTo(endPosition.x, endPosition.y);
    });

    context.closePath();
    context.fill();

    return true;
  }
}
