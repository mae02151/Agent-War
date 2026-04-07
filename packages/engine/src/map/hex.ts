import type { HexCoord } from "@agent-arena/shared";

const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function coordKey(coord: HexCoord): string {
  return `${coord.q},${coord.r}`;
}

export function addCoords(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r };
}

export function getNeighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((direction) => addCoords(coord, direction));
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  const aS = -a.q - a.r;
  const bS = -b.q - b.r;

  return (
    Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(aS - bS)
  ) / 2;
}

