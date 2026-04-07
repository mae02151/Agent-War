# Project Structure Spec V1

## 1. 목적

이 문서는 Agent Arena V1의 실제 구현을 위한 디렉토리 구조와 모듈 분리 기준을 정의한다.

목표:
- 게임 엔진, 서버, 웹 UI, bridge, 공용 스키마를 명확히 분리
- 나중에 멀티유저 대전과 리플레이 기능을 확장하기 쉬운 구조 채택
- 개인 에이전트 연결 구조를 반영한 프로젝트 뼈대 설계

## 2. V1 아키텍처 방향

V1은 하나의 모노레포 구조로 관리한다.

핵심 구성:
- `engine`: authoritative game rules
- `server`: API, match orchestration, persistence
- `web`: 전장 시각화와 계정/매치 UI
- `bridge`: 개인 에이전트 연결용 로컬 bridge
- `shared`: 공용 타입, 스키마, 프로토콜 상수
- `docs`: 지금까지 작성한 설계 문서

## 3. 권장 루트 구조

```text
agent_mon/
  docs/
  apps/
    server/
    web/
    bridge/
  packages/
    engine/
    shared/
    replay/
  scripts/
  infra/
  tmp/
```

## 4. 디렉토리별 역할

## 4.1 `docs/`

역할:
- 기획 문서
- 프로토콜 문서
- 게임 규칙 문서
- 밸런스 문서
- 구현 가이드

현재 작성한 `.md` 파일들은 최종적으로 여기로 모으는 것이 좋다.

## 4.2 `apps/server/`

역할:
- 웹 API
- 인증
- 매치 생성
- WebSocket 이벤트 송신
- bridge 연결 수용
- 게임 진행 orchestration
- DB 연동

서버가 담당하는 것:
- 유저 인증
- 에이전트 등록
- 매치 상태 관리
- observation 생성 요청
- action 수신
- validation 호출
- replay 저장

## 4.3 `apps/web/`

역할:
- 로그인/계정 UI
- 에이전트 연결 상태 UI
- 대전 생성 UI
- 전장 시각화
- 리플레이 뷰어
- objective/standing orders 표시

## 4.4 `apps/bridge/`

역할:
- 사용자 로컬 환경에서 실행되는 bridge
- 플랫폼 WebSocket 연결
- observation 수신
- command context 수신
- 로컬 Codex/에이전트 호출
- action JSON 반환

이 앱은 별도 배포 대상이 아니라 사용자가 로컬에서 실행하는 도구다.

## 4.5 `packages/engine/`

역할:
- authoritative game engine
- 맵 상태 모델
- 턴 처리
- 시야 계산
- 자원 계산
- 전투 계산
- 승리 조건 판정
- action 적용
- validation 보조 로직

중요:
- `engine`은 서버에 종속되지 않게 순수 로직 패키지로 유지한다.
- 테스트하기 가장 쉬운 구조여야 한다.

## 4.6 `packages/shared/`

역할:
- action/observation 타입
- protocol message 타입
- objective order 타입
- enum, constants, error codes
- validation schema

이 패키지는:
- server
- web
- bridge
- engine

모두가 공통으로 참조한다.

## 4.7 `packages/replay/`

역할:
- replay event 모델
- replay serialization
- replay parsing
- turn log formatter

V1에서는 단순할 수 있지만, 초기에 분리해두면 나중에 웹 리플레이어 구현이 쉬워진다.

## 4.8 `scripts/`

역할:
- 개발용 seed 데이터 생성
- 로컬 시뮬레이션 실행
- 테스트 경기 실행
- schema export

## 4.9 `infra/`

역할:
- 로컬 개발용 docker-compose
- DB 초기화
- 배포 관련 설정
- 환경 변수 예시

## 5. 세부 디렉토리 제안

## 5.1 `apps/server/` 세부 구조

```text
apps/server/
  src/
    api/
    auth/
    match/
    agent/
    ws/
    db/
    services/
    config/
    main.ts
  tests/
  package.json
```

### 역할
- `api/`: REST 엔드포인트
- `auth/`: 로그인, 토큰
- `match/`: 매치 생성, 매치 상태
- `agent/`: 에이전트 등록, 연결 관리
- `ws/`: WebSocket 브로드캐스트, bridge 세션
- `db/`: ORM 또는 DB access
- `services/`: orchestration 로직

## 5.2 `apps/web/` 세부 구조

```text
apps/web/
  src/
    app/
    pages/
    components/
    features/
      match/
      replay/
      agents/
      commander/
    lib/
    styles/
  public/
  package.json
```

### 역할
- `features/match/`: 실시간 전장 뷰
- `features/replay/`: 리플레이 재생
- `features/agents/`: 에이전트 등록/상태
- `features/commander/`: objective/standing orders UI

## 5.3 `apps/bridge/` 세부 구조

```text
apps/bridge/
  src/
    cli/
    config/
    protocol/
    runners/
    adapters/
    state/
    main.ts
  package.json
```

### 역할
- `cli/`: bridge 실행 커맨드
- `config/`: 서버 URL, 토큰, 로컬 agent 설정
- `protocol/`: 플랫폼과의 메시지 처리
- `runners/`: 로컬 프로세스 실행
- `adapters/`: Codex CLI, stdin/stdout, local HTTP adapter
- `state/`: 현재 연결 상태, objective context 캐시

## 5.4 `packages/engine/` 세부 구조

```text
packages/engine/
  src/
    map/
    terrain/
    resources/
    units/
    cities/
    combat/
    vision/
    orders/
    validation/
    simulation/
    state/
    index.ts
  tests/
  package.json
```

### 역할
- `map/`: 맵 구조와 좌표
- `terrain/`: 지형 규칙
- `resources/`: 자원 계산
- `units/`: 유닛 상태와 행동
- `cities/`: 도시 생산과 영토
- `combat/`: 전투 계산
- `vision/`: Fog of War
- `orders/`: objective/standing/turn order 처리 보조
- `validation/`: action rule check
- `simulation/`: 턴 처리
- `state/`: 전체 게임 상태 모델

## 5.5 `packages/shared/` 세부 구조

```text
packages/shared/
  src/
    protocol/
    schema/
    types/
    constants/
    errors/
    index.ts
  package.json
```

### 역할
- `protocol/`: WebSocket message types
- `schema/`: observation/action schema
- `types/`: domain type definitions
- `constants/`: terrain, unit, resource enums
- `errors/`: validation error codes

## 5.6 `packages/replay/` 세부 구조

```text
packages/replay/
  src/
    events/
    serializer/
    parser/
    timeline/
    index.ts
  package.json
```

## 6. 데이터 흐름 기준 모듈 분리

### 6.1 턴 진행 흐름

1. `server`가 현재 매치 상태 로드
2. `engine`이 observation 생성
3. `server`가 bridge에 전달
4. `bridge`가 로컬 agent 호출
5. `server`가 action 수신
6. `engine.validation`이 검증
7. `engine.simulation`이 상태 반영
8. `replay` 패키지가 이벤트 저장
9. `web`이 결과 렌더링

### 6.2 왜 이렇게 나누는가

- 엔진을 독립 테스트 가능하게 하기 위해
- 서버가 엔진 세부 구현에 과도하게 의존하지 않게 하기 위해
- bridge를 사용자 로컬 도구로 분리하기 위해
- replay를 나중에 독립 기능으로 키우기 위해

## 7. 기술 스택 정렬

현재 문서 흐름상 가장 자연스러운 선택은 다음과 같다.

- 모노레포
- TypeScript 중심
- 서버: Node.js
- 웹: React
- bridge: Node.js CLI
- 공용 타입: TypeScript

이 방향의 장점:
- `shared` 타입 재사용이 쉽다
- WebSocket, 웹 UI, bridge를 한 언어로 관리 가능
- 엔진도 TypeScript로 가면 통합이 단순하다

주의:
- 이전 문서에서 Python engine 가능성을 열어뒀지만, V1 속도와 통합성만 보면 TypeScript 단일 스택이 더 실용적일 수 있다

## 8. 테스트 구조

### 8.1 우선 테스트 대상

- `packages/engine` 단위 테스트
- `packages/shared` schema 검증 테스트
- `apps/server` API 테스트
- `apps/bridge` protocol 테스트

### 8.2 중요한 테스트 종류

- action validation test
- Fog of War visibility test
- objective order persistence test
- combat resolution test
- city settlement rule test
- replay serialization test

## 9. 환경 변수 분리

### 9.1 `apps/server`
- `DATABASE_URL`
- `JWT_SECRET`
- `WS_PORT`
- `API_PORT`

### 9.2 `apps/web`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

### 9.3 `apps/bridge`
- `AGENT_ARENA_SERVER_URL`
- `AGENT_ARENA_WS_URL`
- `AGENT_ARENA_TOKEN`
- `LOCAL_AGENT_MODE`
- `LOCAL_AGENT_COMMAND`

## 10. V1에서 굳이 지금 안 나눠도 되는 것

아래는 초기에 별도 패키지까지는 없어도 된다.

- AI 코칭 모듈
- 랭킹 계산 모듈
- 맵 에디터
- 토너먼트 시스템

하지만 아래 3개는 초기에 분리하는 게 좋다.

- `engine`
- `shared`
- `bridge`

## 11. 추천 확정안

V1에서는 아래 구조를 추천한다.

```text
agent_mon/
  docs/
  apps/
    server/
    web/
    bridge/
  packages/
    engine/
    shared/
    replay/
  scripts/
  infra/
```

그리고 구현 순서는:

1. `packages/shared`
2. `packages/engine`
3. `apps/server`
4. `apps/bridge`
5. `apps/web`

## 12. 다음 단계

이제 다음으로 바로 이어질 수 있는 작업은 두 가지다.

1. `bridge 구현 가이드`
2. `초기 구현 태스크 분해`

실제로 만들기 시작하려면 다음 문서는 `초기 구현 태스크 분해`가 가장 유용하다.
