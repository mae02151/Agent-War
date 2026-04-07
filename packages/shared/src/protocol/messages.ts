import type { GameAction, CommanderContext, MatchId, Observation } from "../types";

export interface AuthHelloMessage {
  type: "auth.hello";
  token: string;
  protocolVersion: string;
}

export interface AgentRegisterMessage {
  type: "agent.register";
  agentId: string;
  matchId?: MatchId;
}

export interface TurnObservationMessage {
  type: "turn.observation";
  observation: Observation;
  commanderContext: CommanderContext;
  responseDeadlineMs: number;
}

export interface TurnActionMessage {
  type: "turn.action";
  actions: GameAction[];
}

export interface CommandUpdateMessage {
  type: "command.update";
  commanderContext: CommanderContext;
}

export interface MatchResultMessage {
  type: "match.result";
  matchId: MatchId;
  winnerPlayerId: string | null;
  reason: "capital_capture" | "turn_limit_score" | "forfeit";
}

export type ServerToBridgeMessage =
  | TurnObservationMessage
  | CommandUpdateMessage
  | MatchResultMessage;

export type BridgeToServerMessage =
  | AuthHelloMessage
  | AgentRegisterMessage
  | TurnActionMessage;

