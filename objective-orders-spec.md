# Objective Orders Spec V1

## 1. 목적

이 문서는 Agent Arena V1에서 사용되는 `objective_orders`의 타입, 의미, 상태 전이, 완료 조건, 실패 조건을 정의한다.

목표:
- 플레이어가 장군처럼 `목표 기반 명령`을 내릴 수 있어야 한다.
- Codex 같은 개인 에이전트가 해당 목표를 여러 턴에 걸쳐 계속 수행할 수 있어야 한다.
- 서버, bridge, 에이전트가 objective order를 일관되게 해석할 수 있어야 한다.

## 2. 핵심 개념

objective order는 `한 턴짜리 직접 지시`가 아니라 `지속되는 목표`다.

예:
- `A 지점을 공격하고 점령하라`
- `북쪽 자원 지대를 확보하라`
- `상대 정찰 유닛을 추적해 제거하라`

이 명령은 보통 여러 턴에 걸쳐 수행된다.

## 3. V1 원칙

- objective order는 기본적으로 취소 전까지 유지될 수 있다
- 한 경기에서 활성 objective order는 최대 3개
- objective order는 turn order보다 우선순위가 낮고, standing orders보다 우선순위가 높다
- objective order는 한 턴에 실패해도 자동 폐기되지 않는다
- 서버는 objective order 상태를 기록하지만, 전술적 세부 집행은 에이전트가 담당한다
- V1은 5개 objective type을 모두 지원하되, 완료/실패 판정은 단순하게 유지한다

## 3.1 V1 확정 방침

이번 V1에서는 아래 방침으로 고정한다.

- objective type은 5개 모두 지원
- `capture_zone`
- `defend_zone`
- `gather_resource_area`
- `hunt_unit`
- `expand_to_region`

- 활성 objective order 최대 개수는 3개
- 완료는 서버가 최종 판정
- 실패는 자동 판정을 최소화
- 수행이 애매하면 objective는 계속 `active`로 유지
- 플레이어가 직접 취소하는 흐름을 기본으로 둔다
- 타입별 의미는 직관적으로 유지하고, 지나치게 복잡한 서브 규칙은 V1에서 넣지 않는다

이 방침의 의도:
- 목표 명령의 종류는 풍부하게 유지
- 대신 판정 로직은 보수적으로 단순화
- 재미는 살리고 구현 복잡도는 통제

## 4. 공통 구조

```json
{
  "order_id": "ord_17",
  "type": "capture_zone",
  "summary": "A 지점을 공격하고 점령하라",
  "priority": "high",
  "status": "active",
  "issued_at_turn": 10,
  "cancel_policy": "until_cancelled",
  "target": {}
}
```

## 5. 공통 필드 정의

- `order_id`: 명령 고유 ID
- `type`: objective order 타입
- `summary`: 사람 친화적 설명
- `priority`: `low`, `medium`, `high`
- `status`: `active`, `paused`, `completed`, `cancelled`, `failed`
- `issued_at_turn`: 최초 발급 턴
- `cancel_policy`: `until_cancelled`, `until_completed`
- `target`: 목표 대상 정보

## 6. 상태 전이

### 6.1 상태 목록
- `active`
- `paused`
- `completed`
- `cancelled`
- `failed`

### 6.2 상태 의미

#### `active`
- 현재 수행 중

#### `paused`
- 유지되지만 일시적으로 에이전트의 적극 수행 대상에서 제외

#### `completed`
- 목표 달성 완료

#### `cancelled`
- 플레이어가 취소

#### `failed`
- 현재 경기 상태상 더 이상 달성이 불가능하거나 실질적으로 실패

### 6.3 상태 전이 예시
- `active -> completed`
- `active -> cancelled`
- `active -> paused`
- `paused -> active`
- `active -> failed`

## 7. 우선순위 규칙

V1 기준:

1. 서버 규칙
2. legal actions
3. turn order
4. objective orders
5. standing orders
6. agent 기본 전략

의미:
- objective order는 장기 목표다
- turn order가 들어오면 해당 턴에는 turn order가 우선
- turn order가 끝나면 objective order를 다시 이어서 수행

## 8. 목표 해석 원칙

에이전트는 objective order를 아래처럼 해석해야 한다.

- 목표를 단일 행동이 아니라 `다중 턴 계획`으로 본다
- 필요한 경우 병력 집결, 경로 탐색, 정찰, 교전, 점령을 순차적으로 수행한다
- 목표와 직접 충돌하지 않는 범위에서 standing orders를 유지한다
- turn order가 들어오면 해당 턴에는 turn order를 우선 수행하고, 이후 objective 수행을 재개한다

## 9. V1 objective order 타입

V1에서는 아래 5종을 지원한다.

1. `capture_zone`
2. `defend_zone`
3. `gather_resource_area`
4. `hunt_unit`
5. `expand_to_region`

## 10. `capture_zone`

### 10.1 의미
특정 지역 또는 거점을 공격하고 점령하는 명령

### 10.2 예시
- `A 지점을 공격하고 점령하라`
- `남쪽 거점을 확보하라`

### 10.3 target 구조

```json
{
  "zone_id": "A",
  "position": [12, 4]
}
```

### 10.4 에이전트 기대 행동
- 목표 지역까지 경로 확보
- 필요한 병력 이동
- 적 유닛 제거 또는 우회
- 점령 가능 조건 달성
- 점령 행동 수행

### 10.5 완료 조건
- 대상 지역이 내 소유가 됨
- 또는 플랫폼이 해당 지점 점령 완료로 판정

### 10.6 실패 조건
- 목표가 더 이상 존재하지 않음
- 해당 지역이 현재 규칙상 점령 불가능
- 수행 가능 병력이 완전히 상실됨

### 10.7 비고
- 취소 전까지 계속 시도하는 대표적인 objective order다
- V1에서는 자동 실패보다 플레이어 취소를 더 자주 사용하는 쪽을 권장한다

## 11. `defend_zone`

### 11.1 의미
특정 지역 또는 도시를 방어 상태로 유지하는 명령

### 11.2 예시
- `수도를 방어하라`
- `북쪽 자원 지역을 지켜라`

### 11.3 target 구조

```json
{
  "zone_id": "CAPITAL_RING",
  "position": [3, 5],
  "radius": 2
}
```

### 11.4 에이전트 기대 행동
- 방어 유닛 배치
- 적 접근 감시
- 전선 유지
- 필요한 경우 후방 유닛 재배치

### 11.5 완료 조건
- V1에서는 일반적으로 자동 완료되지 않음
- 플레이어가 취소하거나 경기 종료까지 유지되는 명령으로 취급

### 11.6 실패 조건
- 방어 대상 상실
- 해당 지역이 더 이상 의미 없는 상태

### 11.7 비고
- `defend_zone`는 V1에서 사실상 유지형 objective로 동작한다

## 12. `gather_resource_area`

### 12.1 의미
특정 자원 지역을 확보하고 개발하는 명령

### 12.2 예시
- `북동쪽 숲 지대를 확보하라`
- `철 자원 지역을 장악하라`

### 12.3 target 구조

```json
{
  "resource_type": "iron",
  "center": [10, 6],
  "radius": 2
}
```

### 12.4 에이전트 기대 행동
- 지역 정찰
- worker 이동
- 적 위협 제거 또는 회피
- 자원 타일 개발
- 해당 자원이 안정적으로 수집되게 유지

### 12.5 완료 조건
- 지정 자원 지역이 내 영토 또는 실질 지배 상태
- 자원 타일 개발 완료

### 12.6 실패 조건
- 자원 지역 접근 불가
- 지역 상실

### 12.7 비고
- V1에서는 `개발 완료 + 안정적 수집 가능` 정도로 단순하게 판정한다

## 13. `hunt_unit`

### 13.1 의미
특정 적 유닛 또는 유닛 유형을 추적하고 제거하는 명령

### 13.2 예시
- `적 정찰 유닛을 추적해 제거하라`
- `남쪽의 궁수를 잡아라`

### 13.3 target 구조

```json
{
  "target_id": "enemy_unit_3",
  "target_type": "warrior",
  "last_known_position": [8, 10]
}
```

### 13.4 에이전트 기대 행동
- 마지막 관측 위치로 이동
- 추적 정찰
- 근접 또는 사거리 내 교전
- 제거 또는 압박

### 13.5 완료 조건
- 대상 유닛 제거
- 또는 서버가 해당 유닛 소멸 확인

### 13.6 실패 조건
- 오랜 기간 추적 불가
- 대상이 이미 확인 불가 상태로 사라짐

### 13.7 비고
- Fog of War와 잘 맞는 목표 타입
- V1에서는 자동 실패를 강하게 걸지 않고, 플레이어 취소 비중을 높인다

## 14. `expand_to_region`

### 14.1 의미
특정 지역까지 확장하여 도시를 건설하거나 영토를 확보하는 명령

### 14.2 예시
- `동쪽 평야로 확장하라`
- `강 근처에 새 도시를 세워라`

### 14.3 target 구조

```json
{
  "region_id": "east_plains",
  "position": [15, 7]
}
```

### 14.4 에이전트 기대 행동
- settler 보호
- 확장 위치 정찰
- 도시 건설 가능 위치 탐색
- 새 도시 건설

### 14.5 완료 조건
- 목표 지역에 새 도시 설립
- 또는 목표 지역 영토 확보

### 14.6 실패 조건
- 확장 유닛 상실
- 목표 지역 접근 불가

### 14.7 비고
- V1에서는 `도시 설립` 또는 `영토 확보` 중 하나만 만족해도 완료 처리 가능하도록 단순화할 수 있다

## 15. `objective_orders`와 다른 명령의 관계

### 15.1 turn order와의 관계
- turn order는 현재 턴에만 강제 우선
- objective order는 그 턴 이후 다시 이어서 수행

예시:
- objective: `A 지점을 점령하라`
- turn order: `이번 턴은 후퇴하라`

결과:
- 이번 턴 후퇴
- 이후 다시 A 지점 점령 시도 재개

### 15.2 standing orders와의 관계
- standing orders는 일반 정책
- objective order는 конкрет 목표
- 충돌 시 objective order를 우선하되, 가능한 범위에서 standing orders 반영

예시:
- objective: `A 지점 점령`
- standing: `무리한 교전을 피하라`

해석:
- A 지점을 노리되 불필요한 손실은 피하는 방향으로 수행

## 16. 플레이어 조작 규칙

플레이어는 objective order에 대해 아래 조작을 할 수 있다.

- 생성
- 취소
- 일시 정지
- 재개
- 우선순위 변경
- 새 objective 추가

V1 제안:
- 한 턴에 objective 추가/취소는 자유
- 활성 objective는 최대 3개 유지

## 17. 서버 책임

서버는 아래를 기록하고 관리한다.

- objective order 생성 시점
- 상태 변경 이력
- 어떤 턴에 어떤 objective가 활성 상태였는지
- 완료/취소/실패 판정 이벤트

중요:
- 서버는 objective order의 존재와 상태를 관리한다
- 실제 전술 실행은 에이전트가 담당한다

## 18. 리플레이 표시 제안

리플레이에서는 아래 정보를 보여주는 것이 좋다.

- 현재 활성 objective orders
- 목표 생성 시점
- 목표 완료 또는 취소 시점
- 목표 변경 로그

이 정보가 있어야 플레이어가 `내 장기 명령이 실제로 어떻게 수행됐는지` 이해할 수 있다.

## 19. 열려 있는 항목

아직 결정이 필요한 부분:

- `paused` 상태를 V1에서 바로 지원할지
- objective 우선순위를 숫자로 할지 enum으로 할지
- region/zone 식별 체계를 어떻게 둘지
- objective 완료를 서버가 완전 판정할지, 에이전트 보고를 섞을지

## 20. V1 결론

V1에서 objective order는 이 게임의 핵심 재미 중 하나다.

플레이어는:
- 단기 지시를 내릴 수 있어야 하고
- 장기 목표를 걸어둘 수 있어야 하며
- Codex가 그 목표를 여러 턴에 걸쳐 계속 수행하는 걸 봐야 한다

즉, objective order는 `장군의 전략 목표를 지속시키는 장치`다.

## 21. 다음 단계

이 문서 다음으로 이어갈 우선순위는 아래가 좋다.

1. 유닛/도시/자원 수치 밸런스 초안
2. 서버 검증 규칙 상세 문서
3. 맵 생성 규칙 문서
4. bridge 구현 가이드
