import type { GameAction, GameState } from "@agent-arena/shared";

export interface ApplyActionsResult {
  nextState: GameState;
  acceptedActionCount: number;
}

export function applyActions(
  state: GameState,
  actions: GameAction[],
): ApplyActionsResult {
  return {
    nextState: state,
    acceptedActionCount: actions.length,
  };
}

