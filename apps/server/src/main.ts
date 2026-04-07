import { createInitialGameState } from "@agent-arena/engine";

function main(): void {
  const gameState = createInitialGameState(["player-a", "player-b"]);

  console.log("[server] workspace skeleton ready");
  console.log(
    `[server] sample match bootstrapped with ${gameState.players.length} players`,
  );
}

main();

