export const hexToRGBA = (color: string, opacity: number, cosA: number = 1): string => {
  const mixFactor = Math.pow(Math.abs(cosA), 0.5);
  const rgb = [
    [1, 3], // red
    [3, 5], // green
    [5, 7], // blue
  ].map((positions) => {
    const colorValue = parseInt(color.slice(positions[0], positions[1]), 16);
    // Mix between white (255) and color based on |cosA|
    // |cosA| = 1 → full color, |cosA| = 0 → full white
    return Math.round(255 + (colorValue - 255) * mixFactor);
  });

  return `rgba(${rgb.join(',')},${opacity})`;
};

// A 2D Vector primitive
export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
