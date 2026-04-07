import type {
  ObjectiveOrderStatus,
  ObjectiveOrderType,
  OrderPriority,
  ResourceType,
  TerrainType,
  UnitType,
  VisibilityState,
} from "../constants/game";

export type MatchId = string;
export type PlayerId = string;
export type UnitId = string;
export type CityId = string;
export type TileId = string;
export type ObjectiveOrderId = string;

export interface HexCoord {
  q: number;
  r: number;
}

export interface TileResourceNode {
  type: ResourceType;
  amount: number;
  improved: boolean;
}

export interface TileState {
  id: TileId;
  coord: HexCoord;
  terrain: TerrainType;
  ownerId: PlayerId | null;
  cityId: CityId | null;
  resourceNode: TileResourceNode | null;
  visibility: VisibilityState;
}

export type ResourceStockpile = Record<ResourceType, number>;

export interface UnitState {
  id: UnitId;
  ownerId: PlayerId;
  type: UnitType;
  position: HexCoord;
  hp: number;
  maxHp: number;
  movement: number;
  remainingMovement: number;
  vision: number;
  attackRange: number;
  fortified: boolean;
}

export interface CityState {
  id: CityId;
  ownerId: PlayerId;
  name: string;
  position: HexCoord;
  hp: number;
  productionQueue: string[];
}

export interface ObjectiveOrder {
  id: ObjectiveOrderId;
  type: ObjectiveOrderType;
  status: ObjectiveOrderStatus;
  priority: OrderPriority;
  title: string;
  targetTileId?: TileId;
  targetUnitId?: UnitId;
  targetResourceType?: ResourceType;
}

export interface TurnOrder {
  issuedAtTurn: number;
  text: string;
}

export interface StandingOrders {
  summary: string;
  constraints: string[];
}

export interface CommanderContext {
  turnOrder: TurnOrder | null;
  standingOrders: StandingOrders | null;
  objectiveOrders: ObjectiveOrder[];
}

export interface PlayerState {
  id: PlayerId;
  resources: ResourceStockpile;
  cityIds: CityId[];
  unitIds: UnitId[];
}

export interface GameState {
  matchId: MatchId;
  turn: number;
  activePlayerId: PlayerId;
  players: PlayerState[];
  tiles: TileState[];
  units: UnitState[];
  cities: CityState[];
}

export interface KnownEnemyMarker {
  unitType: UnitType;
  lastKnownPosition: HexCoord;
  observedAtTurn: number;
}

export interface Observation {
  matchId: MatchId;
  turn: number;
  playerId: PlayerId;
  visibleTiles: TileState[];
  visibleUnits: UnitState[];
  visibleCities: CityState[];
  knownEnemyMarkers: KnownEnemyMarker[];
  resources: ResourceStockpile;
  legalActionTypes: string[];
}

