import {
  ACTION_TYPES,
  OBJECTIVE_ORDER_TYPES,
  PROTOCOL_VERSION,
  RESOURCE_TYPES,
  UNIT_TYPES,
} from "../constants";

export const schemaCatalog = {
  protocolVersion: PROTOCOL_VERSION,
  actions: ACTION_TYPES,
  objectiveOrderTypes: OBJECTIVE_ORDER_TYPES,
  resources: RESOURCE_TYPES,
  units: UNIT_TYPES,
} as const;

