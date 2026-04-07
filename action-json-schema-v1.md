# Action JSON Schema V1

## 1. 목적

이 문서는 Agent Arena V1에서 플랫폼 서버, agent bridge, 개인 에이전트가 주고받는 핵심 JSON 구조를 정의한다.

범위:
- `turn.observation` payload 내 observation 구조
- `turn.action` payload 내 action 구조
- `commander_context` 구조
- `objective_orders` 구조

이 문서는 구현용 초안이며, 실제 코드에서는 JSON Schema 또는 타입 정의로 한 번 더 고정한다.

## 2. 설계 원칙

- 자유 텍스트가 아니라 구조화된 JSON 사용
- observation은 에이전트가 판단에 필요한 최소 정보만 포함
- action은 서버가 검증 가능한 선언형 구조 사용
- 사람의 지휘 정보는 `commander_context`로 별도 전달
- objective order는 장기 명령으로 유지 가능한 구조여야 함

## 3. 최상위 메시지 맥락

프로토콜 상에서는 보통 아래 메시지 안에 observation/action이 들어간다.

### 3.1 observation 전달

```json
{
  "type": "turn.observation",
  "protocol_version": "v1",
  "request_id": "req_turn_14",
  "timestamp": "2026-04-07T14:10:20Z",
  "payload": {
    "match_id": "match_9001",
    "turn": 14,
    "deadline_at": "2026-04-07T14:10:40Z",
    "observation": {}
  }
}
```

### 3.2 action 반환

```json
{
  "type": "turn.action",
  "protocol_version": "v1",
  "request_id": "req_turn_14",
  "timestamp": "2026-04-07T14:10:31Z",
  "payload": {
    "match_id": "match_9001",
    "turn": 14,
    "agent_compute_ms": 9432,
    "actions": []
  }
}
```

## 4. Observation Schema

### 4.1 observation 루트 구조

```json
{
  "match_id": "match_9001",
  "turn": 14,
  "player_slot": 1,
  "max_turns": 70,
  "turn_time_limit_ms": 20000,
  "resources": {},
  "owned_cities": [],
  "owned_units": [],
  "visible_tiles": [],
  "visible_enemies": [],
  "known_enemy_markers": [],
  "legal_actions": [],
  "commander_context": {}
}
```

### 4.2 observation 필드 설명

- `match_id`: 경기 ID
- `turn`: 현재 턴 번호
- `player_slot`: 플레이어 번호
- `max_turns`: 최대 턴 수
- `turn_time_limit_ms`: 이번 턴 시간 제한
- `resources`: 현재 보유 자원
- `owned_cities`: 내 도시 정보
- `owned_units`: 내 유닛 정보
- `visible_tiles`: 현재 시야 내 타일
- `visible_enemies`: 현재 시야 내 적 정보
- `known_enemy_markers`: 과거 관측 적 정보
- `legal_actions`: 허용 가능한 행동 종류 힌트
- `commander_context`: 사람의 지휘 명령 컨텍스트

## 5. Resource Schema

```json
{
  "food": 12,
  "wood": 9,
  "iron": 4,
  "gold": 15
}
```

규칙:
- 모든 자원은 0 이상의 정수
- 관측 시점 기준 보유량만 전달

## 6. City Schema

```json
{
  "id": "city_1",
  "name": "Capital",
  "kind": "capital",
  "hp": 30,
  "position": [3, 5],
  "territory_radius": 2,
  "production_queue": [
    {
      "type": "unit",
      "unit_type": "warrior",
      "remaining_turns": 2
    }
  ]
}
```

필드:
- `id`: 도시 ID
- `name`: 도시 이름
- `kind`: `capital` 또는 `city`
- `hp`: 내구도
- `position`: 헥스 좌표
- `territory_radius`: 영토 반경
- `production_queue`: 생산 대기열

## 7. Unit Schema

```json
{
  "id": "unit_12",
  "type": "scout",
  "hp": 6,
  "position": [4, 6],
  "moves_left": 4,
  "vision_range": 4,
  "status": "ready",
  "fortified": false
}
```

필드:
- `id`: 유닛 ID
- `type`: `scout`, `warrior`, `archer`, `worker`, `settler`
- `hp`: 현재 체력
- `position`: 헥스 좌표
- `moves_left`: 남은 이동력
- `vision_range`: 시야
- `status`: `ready`, `spent`, `fortified`, `building`
- `fortified`: 방어 태세 여부

## 8. Visible Tile Schema

```json
{
  "q": 5,
  "r": 7,
  "terrain": "forest",
  "owner": "player_1",
  "resource_node": {
    "type": "wood",
    "amount": 2,
    "improved": true
  },
  "has_city": false,
  "has_unit": true
}
```

필드:
- `q`, `r`: 헥스 좌표
- `terrain`: 지형 타입
- `owner`: `player_1`, `player_2`, `neutral`, `unknown`
- `resource_node`: 자원 노드 정보
- `has_city`: 도시 존재 여부
- `has_unit`: 유닛 존재 여부

## 9. Visible Enemy Schema

```json
{
  "id": "enemy_unit_3",
  "type": "warrior",
  "hp": 8,
  "position": [8, 10]
}
```

V1 원칙:
- 시야 내 적 정보만 정확하게 제공
- 시야 밖 적은 `known_enemy_markers`에 추정 정보로만 남긴다

## 10. Known Enemy Marker Schema

```json
{
  "marker_id": "marker_3",
  "last_seen_turn": 11,
  "estimated_type": "warrior",
  "last_seen_position": [8, 10]
}
```

## 11. Commander Context Schema

### 11.1 루트 구조

```json
{
  "mode": "objective_orders",
  "priority_rule": "turn_order_overrides_objectives_over_standing",
  "turn_order": "이번 턴은 교전보다 정찰을 우선하라",
  "standing_orders": [],
  "objective_orders": []
}
```

### 11.2 필드 설명

- `mode`: `commander`, `standing_orders`, `objective_orders`, `mixed`
- `priority_rule`: 해석 우선순위 설명
- `turn_order`: 이번 턴 직접 지시
- `standing_orders`: 일반 운영 방침
- `objective_orders`: 장기 목표 명령 목록

## 12. Standing Orders Schema

```json
[
  "상대 본진을 찾기 전까지 병력 손실을 최소화한다",
  "본진 주변 3칸 이내는 항상 방어 유닛을 유지한다"
]
```

V1 원칙:
- 문자열 배열로 단순화
- 필요하면 V2에서 구조화 가능

## 13. Objective Order Schema

### 13.1 단일 objective order

```json
{
  "order_id": "ord_17",
  "type": "capture_zone",
  "summary": "A 지점을 공격하고 점령하라",
  "priority": "high",
  "status": "active",
  "issued_at_turn": 10,
  "cancel_policy": "until_cancelled",
  "target": {
    "zone_id": "A",
    "position": [12, 4]
  }
}
```

### 13.2 필드 설명

- `order_id`: 명령 ID
- `type`: 목표 타입
- `summary`: 사람 친화적 요약
- `priority`: `low`, `medium`, `high`
- `status`: `active`, `paused`, `completed`, `cancelled`, `failed`
- `issued_at_turn`: 발급 턴
- `cancel_policy`: `until_cancelled`, `until_completed`
- `target`: 목표 위치/대상

### 13.3 V1 objective type 목록

- `capture_zone`
- `defend_zone`
- `gather_resource_area`
- `hunt_unit`
- `expand_to_region`

## 14. Legal Actions Hint Schema

```json
[
  "move",
  "attack",
  "produce",
  "build",
  "gather",
  "capture",
  "fortify",
  "settle_city",
  "end_turn"
]
```

원칙:
- 이것은 힌트이며, 실제 유효성은 서버가 최종 판정

## 15. Action Payload Schema

### 15.1 루트 구조

```json
{
  "match_id": "match_9001",
  "turn": 14,
  "agent_compute_ms": 9432,
  "actions": [],
  "debug": {
    "agent_version_label": "alpha-7",
    "notes": "optional"
  }
}
```

### 15.2 필드 설명

- `match_id`: 경기 ID
- `turn`: 현재 턴 번호
- `agent_compute_ms`: 에이전트 계산 시간
- `actions`: 행동 배열
- `debug`: 선택 필드

## 16. Action 공통 규칙

- `actions`는 순서 배열이다
- 서버는 배열 순서대로 해석할 수 있다
- 일부 action이 무효여도 나머지 유효 action은 반영 가능하다
- action이 비어 있으면 서버는 `end_turn`로 해석할 수 있다

## 17. Action Type Schemas

### 17.1 `move`

```json
{
  "type": "move",
  "unit_id": "unit_12",
  "to": [5, 6]
}
```

필드:
- `unit_id`: 이동할 유닛
- `to`: 목적지 좌표

### 17.2 `attack`

```json
{
  "type": "attack",
  "unit_id": "unit_5",
  "target_type": "unit",
  "target_id": "enemy_unit_3"
}
```

필드:
- `unit_id`: 공격 수행 유닛
- `target_type`: `unit` 또는 `city`
- `target_id`: 공격 대상 ID

### 17.3 `produce`

```json
{
  "type": "produce",
  "city_id": "city_1",
  "production_type": "unit",
  "unit_type": "warrior"
}
```

필드:
- `city_id`: 생산 도시
- `production_type`: V1에서는 `unit`
- `unit_type`: 생산 유닛 종류

### 17.4 `build`

```json
{
  "type": "build",
  "unit_id": "worker_2",
  "build_type": "improve_resource",
  "target": [7, 8]
}
```

필드:
- `unit_id`: worker ID
- `build_type`: `improve_resource`, `road`, `fort`
- `target`: 작업 좌표

### 17.5 `gather`

```json
{
  "type": "gather",
  "unit_id": "worker_2",
  "target": [7, 8]
}
```

V1 참고:
- 도시 자동 수집이 기본이면 `gather`는 worker 특수 행동으로 축소 가능

### 17.6 `capture`

```json
{
  "type": "capture",
  "unit_id": "warrior_4",
  "target": [12, 4]
}
```

용도:
- 특정 점령 지점
- 중립 거점
- objective order 대상 지역

### 17.7 `fortify`

```json
{
  "type": "fortify",
  "unit_id": "warrior_4"
}
```

### 17.8 `settle_city`

```json
{
  "type": "settle_city",
  "unit_id": "settler_1",
  "city_name": "New Frontier"
}
```

### 17.9 `end_turn`

```json
{
  "type": "end_turn"
}
```

## 18. 전체 예시

### 18.1 observation 예시

```json
{
  "match_id": "match_9001",
  "turn": 14,
  "player_slot": 1,
  "max_turns": 70,
  "turn_time_limit_ms": 20000,
  "resources": {
    "food": 12,
    "wood": 9,
    "iron": 4,
    "gold": 15
  },
  "owned_cities": [
    {
      "id": "city_1",
      "name": "Capital",
      "kind": "capital",
      "hp": 30,
      "position": [3, 5],
      "territory_radius": 2,
      "production_queue": []
    }
  ],
  "owned_units": [
    {
      "id": "unit_12",
      "type": "scout",
      "hp": 6,
      "position": [4, 6],
      "moves_left": 4,
      "vision_range": 4,
      "status": "ready",
      "fortified": false
    }
  ],
  "visible_tiles": [],
  "visible_enemies": [],
  "known_enemy_markers": [],
  "legal_actions": [
    "move",
    "attack",
    "produce",
    "build",
    "capture",
    "fortify",
    "end_turn"
  ],
  "commander_context": {
    "mode": "mixed",
    "priority_rule": "turn_order_overrides_objectives_over_standing",
    "turn_order": "이번 턴은 정찰을 우선하고 교전은 피하라",
    "standing_orders": [
      "상대 본진을 찾기 전까지 병력 손실을 최소화한다"
    ],
    "objective_orders": [
      {
        "order_id": "ord_17",
        "type": "capture_zone",
        "summary": "A 지점을 공격하고 점령하라",
        "priority": "high",
        "status": "active",
        "issued_at_turn": 10,
        "cancel_policy": "until_cancelled",
        "target": {
          "zone_id": "A",
          "position": [12, 4]
        }
      }
    ]
  }
}
```

### 18.2 action 예시

```json
{
  "match_id": "match_9001",
  "turn": 14,
  "agent_compute_ms": 9432,
  "actions": [
    {
      "type": "move",
      "unit_id": "unit_12",
      "to": [5, 6]
    },
    {
      "type": "produce",
      "city_id": "city_1",
      "production_type": "unit",
      "unit_type": "warrior"
    },
    {
      "type": "end_turn"
    }
  ],
  "debug": {
    "agent_version_label": "alpha-7"
  }
}
```

## 19. 서버 검증 원칙

- `match_id`, `turn` 불일치 시 거부
- 존재하지 않는 unit/city 참조 시 해당 action 무효
- 시야 밖 적을 직접 지정한 공격은 무효 가능
- 자원 부족 생산은 무효
- 이동력 초과 이동은 무효
- 전체 action이 전부 무효여도 매치는 계속 진행

## 20. 아직 열려 있는 항목

- 각 유닛별 체력/공격력/방어력 숫자
- `build_type` 세부 목록
- `capture`가 적용되는 대상 범위
- `gather`를 남길지 도시 자동 수집으로 단순화할지
- `known_enemy_markers` 보존 턴 수
- `legal_actions`를 단순 문자열로 둘지 구조화할지

## 21. 다음 단계

이 문서 다음 작업은 아래 순서가 좋다.

1. objective order 타입별 세부 규칙
2. 유닛/도시/자원 수치 밸런스 문서
3. 서버 검증 규칙 상세 문서
4. bridge 구현 가이드
