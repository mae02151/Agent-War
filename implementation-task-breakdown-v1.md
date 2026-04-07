# Implementation Task Breakdown V1

## 1. 목적

이 문서는 Agent Arena V1을 실제로 구현하기 위한 초기 작업을 우선순위와 의존관계 기준으로 분해한 실행 문서다.

목표:
- 무엇부터 만들어야 하는지 명확히 정리
- 각 작업의 산출물을 분명하게 정의
- 설계 문서에서 구현 단계로 바로 넘어갈 수 있게 함

## 2. 구현 원칙

- 먼저 `공용 타입`과 `엔진 코어`를 만든다
- 그 다음 `서버`, `bridge`, `웹` 순으로 붙인다
- UI보다 엔진과 프로토콜이 먼저다
- 플레이 가능한 최소 루프를 먼저 만든 뒤 확장한다

## 3. MVP 구현 순서 요약

권장 순서:

1. 프로젝트 뼈대 생성
2. shared 타입/스키마 구현
3. engine 상태 모델 구현
4. engine 핵심 룰 구현
5. 로컬 시뮬레이터 구현
6. server 기본 API / WS 구현
7. bridge MVP 구현
8. server + engine + bridge 연결
9. web 최소 관전 UI 구현
10. replay / 로그 저장

## 4. Phase 0: 프로젝트 뼈대 생성

### Task 0.1 모노레포 초기화

내용:
- 루트 `package.json`
- 워크스페이스 설정
- 기본 스크립트 설정

산출물:
- workspace 동작
- 앱/패키지별 dependency 구조 확정

### Task 0.2 기본 디렉토리 생성

대상:
- `apps/server`
- `apps/web`
- `apps/bridge`
- `packages/engine`
- `packages/shared`
- `packages/replay`
- `docs`

산출물:
- 프로젝트 구조 고정

### Task 0.3 공통 개발 설정

내용:
- TypeScript 설정
- lint/format 설정
- test runner 설정

산출물:
- 전체 레포 공통 설정

## 5. Phase 1: Shared 패키지 구현

이 단계가 가장 먼저다. 여기서 타입과 스키마를 고정해야 전체 구현이 흔들리지 않는다.

### Task 1.1 도메인 enum 정의

내용:
- resource types
- unit types
- terrain types
- objective order types
- action types

산출물:
- `packages/shared/src/constants/*`

### Task 1.2 핵심 타입 정의

내용:
- game state 타입
- city 타입
- unit 타입
- tile 타입
- observation 타입
- action 타입
- commander context 타입

산출물:
- `packages/shared/src/types/*`

### Task 1.3 protocol message 타입 정의

내용:
- `auth.hello`
- `agent.register`
- `turn.observation`
- `turn.action`
- `command.update`
- `match.result`

산출물:
- `packages/shared/src/protocol/*`

### Task 1.4 validation schema 정의

내용:
- action schema
- observation schema
- objective order schema

산출물:
- `packages/shared/src/schema/*`

완료 기준:
- server, engine, bridge가 shared 타입을 참조 가능

## 6. Phase 2: Engine 상태 모델 구현

### Task 2.1 좌표 및 맵 모델 구현

내용:
- 헥스 좌표 타입
- 인접 타일 계산
- 거리 계산
- 맵 생성 기본 구조

산출물:
- `packages/engine/src/map/*`

### Task 2.2 타일/지형 모델 구현

내용:
- terrain 타입별 속성
- 통과 가능 여부
- 방어 보정
- 시야 차단 여부

산출물:
- `packages/engine/src/terrain/*`

### Task 2.3 엔티티 상태 모델 구현

내용:
- unit state
- city state
- resource node state
- ownership state

산출물:
- `packages/engine/src/state/*`

### Task 2.4 초기 게임 상태 생성기

내용:
- 시작 도시 배치
- 시작 유닛 배치
- 초기 자원 지급

산출물:
- 새 매치 초기화 가능

## 7. Phase 3: Engine 핵심 룰 구현

### Task 3.1 Fog of War 계산

내용:
- 유닛별 시야 계산
- visible / explored / unseen 구분
- known enemy marker 생성

산출물:
- observation 생성 가능

### Task 3.2 이동 룰 구현

내용:
- 이동력 계산
- 지형 이동 가능 여부
- 목적지 점유 판정

산출물:
- `move` action 적용 가능

### Task 3.3 전투 룰 구현

내용:
- 공격 가능 판정
- 피해량 계산
- 유닛 제거 처리

산출물:
- `attack` action 적용 가능

### Task 3.4 도시 생산 룰 구현

내용:
- 생산 큐
- 자원 차감
- 턴 경과 처리

산출물:
- `produce` action 적용 가능

### Task 3.5 worker / settler 룰 구현

내용:
- 자원 개발
- 도시 건설
- 영토 생성

산출물:
- `build`, `settle_city`, `capture` 일부 구현 가능

### Task 3.6 승리 조건 구현

내용:
- 수도 점령 판정
- 턴 제한 종료
- 점수 계산

산출물:
- 경기 종료 판정 가능

## 8. Phase 4: Engine Validation 구현

### Task 4.1 action 공통 검증

내용:
- ownership 확인
- entity 존재 여부
- 턴 상태 확인

### Task 4.2 action 타입별 검증

내용:
- move
- attack
- produce
- build
- gather
- capture
- fortify
- settle_city
- end_turn

### Task 4.3 부분 반영 처리

내용:
- action별 accepted/rejected 결과
- 일부만 반영하는 처리

완료 기준:
- action payload를 받아 검증 + 적용 가능

## 9. Phase 5: 로컬 시뮬레이터

### Task 5.1 CLI 시뮬레이터 구현

내용:
- 매치 생성
- 턴 진행
- 두 더미 에이전트 연결
- 로그 출력

산출물:
- 웹 없이도 한 판 실행 가능

### Task 5.2 더미 에이전트 2종 구현

예시:
- 랜덤 행동 봇
- 간단한 룰 기반 확장/전투 봇

산출물:
- 기본 플레이 테스트 가능

### Task 5.3 리플레이 이벤트 출력

내용:
- 턴 로그
- action 결과
- 승패 로그

산출물:
- replay 패키지 연동 기반 마련

## 10. Phase 6: Server MVP

### Task 6.1 서버 앱 초기화

내용:
- REST API skeleton
- WebSocket server skeleton
- config 로딩

### Task 6.2 match 도메인 구현

내용:
- 매치 생성
- 매치 상태 저장
- 현재 턴 조회

### Task 6.3 bridge 세션 관리

내용:
- bridge 연결 수립
- heartbeat 관리
- agent 등록 상태 추적

### Task 6.4 turn orchestration

내용:
- observation 생성 요청
- bridge에 송신
- action 응답 수신
- timeout 처리
- engine 호출

완료 기준:
- 서버에서 1경기 자동 진행 가능

## 11. Phase 7: Bridge MVP

### Task 7.1 bridge CLI 초기화

내용:
- 실행 명령
- 환경 변수 로딩
- 서버 연결

### Task 7.2 protocol client 구현

내용:
- auth.hello
- agent.register
- heartbeat
- turn.observation 수신
- turn.action 송신

### Task 7.3 local adapter 구현

V1 우선순위:
- mock adapter
- stdin/stdout adapter
- local command adapter

나중 옵션:
- Codex CLI adapter
- local HTTP adapter

### Task 7.4 command context 전달

내용:
- turn order
- standing orders
- objective orders

완료 기준:
- 로컬 에이전트가 observation을 받아 action JSON 반환 가능

## 12. Phase 8: Server + Bridge + Engine 통합

### Task 8.1 단일 매치 end-to-end 실행

내용:
- 서버 1개
- bridge 2개
- 더미 에이전트 2개
- 1경기 전체 진행

### Task 8.2 오류 흐름 검증

내용:
- timeout
- invalid action
- reconnect
- partial apply

완료 기준:
- 운영 가능한 최소 대전 루프 확보

## 13. Phase 9: Web MVP

### Task 9.1 기본 앱 초기화

내용:
- 라우팅
- API client
- WebSocket client

### Task 9.2 매치 관전 화면

내용:
- 맵 렌더링
- 유닛 렌더링
- Fog of War 렌더링
- 턴 로그 표시

### Task 9.3 에이전트 연결 상태 화면

내용:
- bridge 연결 여부
- agent 메타데이터
- 최근 응답 시간

### Task 9.4 commander 상태 표시

내용:
- turn order
- standing orders
- objective orders

완료 기준:
- 웹에서 경기 흐름을 볼 수 있음

## 14. Phase 10: Replay / Persistence

### Task 10.1 replay event 모델 저장

내용:
- 턴별 action 결과 저장
- objective 상태 변경 저장

### Task 10.2 match result 저장

내용:
- 승패
- 종료 사유
- 경기 메타데이터

### Task 10.3 replay 재생 구조 마련

내용:
- timeline event 생성
- 웹 뷰어에서 읽을 수 있는 형식으로 직렬화

## 15. 가장 먼저 구현할 최소 세트

문서상으로 많아 보이지만, 가장 먼저 돌려볼 최소 세트는 아래다.

1. `packages/shared`
2. `packages/engine`
3. `apps/server`
4. `apps/bridge`
5. 더미 봇 2개

이 다섯 개만 있어도 터미널 기반 자동 대전은 돌릴 수 있다.

## 16. 구현 착수용 첫 작업 목록

실제로 지금 바로 시작한다면 아래 순서가 좋다.

1. workspace 초기화
2. `packages/shared` 타입 생성
3. `packages/engine`에 hex map / unit / city state 생성
4. observation 생성 함수 구현
5. move / attack validation 구현
6. CLI 시뮬레이터 생성
7. bridge skeleton 생성
8. server WebSocket skeleton 생성

## 17. 작업 단위 크기 조절 기준

너무 큰 작업은 아래처럼 쪼개는 것이 좋다.

- `engine 구현`이 아니라
  - hex 좌표
  - 맵 상태
  - 유닛 상태
  - 이동
  - 시야
  - 전투

- `web 구현`이 아니라
  - 타일 렌더
  - 유닛 렌더
  - 시야 마스킹
  - 로그 패널

## 18. 리스크가 큰 작업

초기에 특히 주의할 것:

1. Fog of War 계산
2. 부분 반영 validation
3. objective order 지속성
4. bridge reconnect
5. replay 이벤트 일관성

이 다섯 개는 초기에 테스트를 붙여야 한다.

## 19. 완료 기준

V1 구현의 첫 완료 기준은 아래다.

- 두 개의 bridge가 서버에 연결된다
- 서버가 observation을 보낸다
- 두 에이전트가 action을 돌려준다
- engine이 action을 검증하고 턴을 진행한다
- 웹에서 맵과 턴 로그를 볼 수 있다
- 수도 점령 또는 턴 종료 시 승패가 결정된다

## 20. 다음 단계

이 문서 다음으로 바로 할 수 있는 선택지는 두 개다.

1. `bridge 구현 가이드` 작성
2. 실제 프로젝트 뼈대 생성 시작

지금은 설계 문서가 충분하므로, 다음은 실제 프로젝트 뼈대를 만드는 단계로 넘어가도 된다.
