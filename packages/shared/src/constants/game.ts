export const PROTOCOL_VERSION = "v1";

export const RESOURCE_TYPES = ["food", "wood", "iron", "gold"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const UNIT_TYPES = [
  "scout",
  "warrior",
  "archer",
  "worker",
  "settler",
] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export const TERRAIN_TYPES = [
  "plains",
  "forest",
  "hill",
  "mountain",
  "river",
  "coast",
  "water",
] as const;
export type TerrainType = (typeof TERRAIN_TYPES)[number];

export const OBJECTIVE_ORDER_TYPES = [
  "capture_zone",
  "defend_zone",
  "gather_resource_area",
  "hunt_unit",
  "expand_to_region",
] as const;
export type ObjectiveOrderType = (typeof OBJECTIVE_ORDER_TYPES)[number];

export const OBJECTIVE_ORDER_STATUSES = [
  "active",
  "completed",
  "cancelled",
  "failed",
] as const;
export type ObjectiveOrderStatus = (typeof OBJECTIVE_ORDER_STATUSES)[number];

export const ORDER_PRIORITIES = ["low", "medium", "high"] as const;
export type OrderPriority = (typeof ORDER_PRIORITIES)[number];

export const ACTION_TYPES = [
  "move",
  "attack",
  "produce",
  "build",
  "gather",
  "capture",
  "fortify",
  "settle_city",
  "end_turn",
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

export const VISIBILITY_STATES = ["visible", "explored", "unseen"] as const;
export type VisibilityState = (typeof VISIBILITY_STATES)[number];

