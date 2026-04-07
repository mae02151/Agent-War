import type { ActionType, ResourceType, UnitType } from "../constants/game";
import type { CityId, HexCoord, TileId, UnitId } from "./game";

interface BaseAction {
  type: ActionType;
}

export interface MoveAction extends BaseAction {
  type: "move";
  unitId: UnitId;
  to: HexCoord;
}

export interface AttackAction extends BaseAction {
  type: "attack";
  attackerUnitId: UnitId;
  targetUnitId: UnitId;
}

export interface ProduceAction extends BaseAction {
  type: "produce";
  cityId: CityId;
  unitType: UnitType;
}

export interface BuildAction extends BaseAction {
  type: "build";
  unitId: UnitId;
  improvement: "farm" | "lumber_mill" | "mine";
  tileId: TileId;
}

export interface GatherAction extends BaseAction {
  type: "gather";
  unitId: UnitId;
  tileId: TileId;
  resourceType: ResourceType;
}

export interface CaptureAction extends BaseAction {
  type: "capture";
  unitId: UnitId;
  tileId: TileId;
}

export interface FortifyAction extends BaseAction {
  type: "fortify";
  unitId: UnitId;
  enabled: boolean;
}

export interface SettleCityAction extends BaseAction {
  type: "settle_city";
  unitId: UnitId;
  cityName: string;
}

export interface EndTurnAction extends BaseAction {
  type: "end_turn";
}

export type GameAction =
  | MoveAction
  | AttackAction
  | ProduceAction
  | BuildAction
  | GatherAction
  | CaptureAction
  | FortifyAction
  | SettleCityAction
  | EndTurnAction;

