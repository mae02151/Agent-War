import { PROTOCOL_VERSION } from "@agent-arena/shared";

function bootstrapWebShell(): void {
  console.log("[web] battlefield client skeleton ready");
  console.log(`[web] shared protocol version: ${PROTOCOL_VERSION}`);
}

bootstrapWebShell();

