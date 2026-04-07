import type { CityState, GameState, PlayerId, PlayerState, UnitState } from "@agent-arena/shared";

function createPlayerState(id: PlayerId): PlayerState {
  return {
    id,
    resources: {
      food: 8,
      wood: 6,
      iron: 4,
      gold: 5,
    },
    cityIds: [`${id}-capital`],
    unitIds: [`${id}-scout-1`, `${id}-warrior-1`, `${id}-worker-1`, `${id}-settler-1`],
  };
}

function createCapitalCity(ownerId: PlayerId, q: number, r: number): CityState {
  return {
    id: `${ownerId}-capital`,
    ownerId,
    name: `${ownerId} Capital`,
    position: { q, r },
    hp: 25,
    productionQueue: [],
  };
}

function createStarterUnits(ownerId: PlayerId, q: number, r: number): UnitState[] {
  return [
    {
      id: `${ownerId}-scout-1`,
      ownerId,
      type: "scout",
      position: { q: q + 1, r },
      hp: 7,
      maxHp: 7,
      movement: 3,
      remainingMovement: 3,
      vision: 3,
      attackRange: 1,
      fortified: false,
    },
    {
      id: `${ownerId}-warrior-1`,
      ownerId,
      type: "warrior",
      position: { q, r: r + 1 },
      hp: 12,
      maxHp: 12,
      movement: 2,
      remainingMovement: 2,
      vision: 2,
      attackRange: 1,
      fortified: false,
    },
    {
      id: `${ownerId}-worker-1`,
      ownerId,
      type: "worker",
      position: { q: q - 1, r },
      hp: 6,
      maxHp: 6,
      movement: 2,
      remainingMovement: 2,
      vision: 2,
      attackRange: 0,
      fortified: false,
    },
    {
      id: `${ownerId}-settler-1`,
      ownerId,
      type: "settler",
      position: { q, r: r - 1 },
      hp: 8,
      maxHp: 8,
      movement: 2,
      remainingMovement: 2,
      vision: 2,
      attackRange: 0,
      fortified: false,
    },
  ];
}

export function createInitialGameState(playerIds: PlayerId[]): GameState {
  const startingPositions = [
    { q: -6, r: 0 },
    { q: 6, r: 0 },
  ];

  const players = playerIds.map(createPlayerState);
  const cities = playerIds.map((playerId, index) => {
    const position = startingPositions[index] ?? { q: 0, r: index * 4 };
    return createCapitalCity(playerId, position.q, position.r);
  });
  const units = playerIds.flatMap((playerId, index) => {
    const position = startingPositions[index] ?? { q: 0, r: index * 4 };
    return createStarterUnits(playerId, position.q, position.r);
  });

  return {
    matchId: "match-local-dev",
    turn: 1,
    activePlayerId: playerIds[0] ?? "player-a",
    players,
    tiles: [],
    units,
    cities,
  };
}

