import type { GameAction, MatchId } from "@agent-arena/shared";

export interface ReplayEvent {
  matchId: MatchId;
  turn: number;
  action: GameAction;
  timestamp: string;
}

export function createReplayEvent(
  matchId: MatchId,
  turn: number,
  action: GameAction,
): ReplayEvent {
  return {
    matchId,
    turn,
    action,
    timestamp: new Date(0).toISOString(),
  };
}

