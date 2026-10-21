# Design.md

기준: 현재 파일의 로컬 변수, 텍스트 스타일, 실습 페이지의 Components 섹션, 390×844 모바일 화면 예시.

- 수치는 별도 표기가 없으면 px이다.
- 모든 변수 컬렉션은 Default 모드만 정의되어 있다. 다크 모드는 정의되어 있지 않다.
- 색상은 별칭을 최종 해석한 값이다.
- ‘확인’은 컴포넌트 정의 또는 화면 예시에서 확인한 내용이다.
- ‘권장’은 확인한 구조를 바탕으로 한 적용 지침이며, 기존 정의와 구분한다.
- ‘사용 미확인’은 조사한 Components 및 모바일 예시에서 실제 적용을 확인하지 못했다는 뜻이다.

## 1. 색 팔레트

### 1.1 토큰 구조

색상은 primitive 컬렉션의 원시 색상을 semantic 컬렉션에서 참조하는 구조다.

예:
- gray/900 → text/primary
- pink/500 → fill/primary
- pink/500 → text/accent
- pink/600 → fill/primary-hover

같은 색상 값이라도 역할이 다른 semantic 토큰은 구분한다.
예를 들어 text/accent와 icon/accent는 값이 같지만 적용 대상이 다르다.

effect/shadow-subtle은 별칭 없이 직접 정의된 색상이다.

### 1.2 텍스트

| Semantic 토큰 | 값 | Primitive 참조 | 쓰는 곳 |
|---|---|---|---|
| text/primary | #181A1B | gray/900 | 제목, 본문 주요 정보, 입력 완료 값, Secondary 버튼 라벨 |
| text/secondary | #66707A | gray/600 | 설명, 정보 행의 라벨, 카드 설명, Tag 라벨 |
| text/tertiary | #878787 | gray/500 | 가격 요약의 보조 라벨·정가 등 낮은 강조의 정보 |
| text/on-dark | #FFFFFF | gray/0 | Primary 버튼, 어두운 Chip, 선택된 FilterChip의 라벨 |
| text/error | #E30036 | red/500 | Input caution 상태의 오류 메시지 |
| text/placeholder | #B7BDC4 | gray/400 | 입력 전 안내 값 |
| text/on-disabled | #66707A | gray/600 | 비활성 Input의 텍스트 |
| text/accent | #FF2E98 | pink/500 | 할인율, 단계 표시, List/Row check 변형의 강조 값 |

### 1.3 배경·표면

| Semantic 토큰 | 값 | Primitive 참조 | 쓰는 곳 |
|---|---|---|---|
| bg/surface | #FFFFFF | gray/0 | Header, BottomCTA, Card/Plan 등 기본 표면 |
| bg/default | #F7F7F7 | gray/100 | 가격 요약 패널, 선택된 OptionItem 배경 |
| bg/subtle | #EFF1F3 | gray/200 | 비활성 Input 배경, Secondary 버튼 Hover, 혜택 Chip, 진행 표시 트랙 |
| bg/inverse | #2D2D2D | gray/800 | 반전 배경용. 실제 사용 미확인 |
| bg/accent-subtle | #FFF5FA | pink/50 | 할인 Chip, 프로모션 Chip의 연한 강조 배경 |
| bg/error-subtle | #FFF0F3 | red/50 | 오류 관련 연한 배경용. 실제 사용 미확인 |
| surface/default | #FFFFFF | gray/0 | Secondary 버튼의 기본 배경 |

bg/surface와 surface/default는 같은 값이지만 서로 다른 토큰이다.
확인된 사용처에 맞게 유지하며, 임의로 하나로 합치지 않는다.

### 1.4 테두리·구분선

| Semantic 토큰 | 값 | Primitive 참조 | 쓰는 곳 |
|---|---|---|---|
| border/default | #D9DCDF | gray/300 | 기본 Input, Secondary 버튼, 기본 카드·선택지·FilterChip 테두리 |
| border/subtle | #EFF1F3 | gray/200 | List/Row와 BottomCTA의 구분선, Tag 배경 |
| border/strong | #181A1B | gray/900 | 강한 테두리용. 실제 사용 미확인 |
| border/divider | rgba(0, 0, 0, 0.10) | black/10 | 구분선용. Components 내부 섹션 경계에도 적용됨 |
| border/focus | #FF2E98 | pink/500 | Input focus 상태의 선 |
| border/error | #E30036 | red/500 | Input caution 상태의 선 |
| border/medium | #66707A | gray/600 | 선택된 Card/Plan과 OptionItem의 테두리 |

### 1.5 액션·상태 채움

| Semantic 토큰 | 값 | Primitive 참조 | 쓰는 곳 |
|---|---|---|---|
| fill/primary | #FF2E98 | pink/500 | Primary 버튼, 활성 Checkbox, 완료 표시, 선택된 OptionItem의 라디오 표시 |
| fill/secondary | #181A1B | gray/900 | package Chip, 선택된 FilterChip 배경 |
| fill/tertiary | #EFF1F3 | gray/200 | 3차 채움용. 실제 사용 미확인 |
| fill/disabled | #D9DCDF | gray/300 | 비활성 Button 배경 |
| fill/disabled-strong | #B7BDC4 | gray/400 | 더 강한 비활성 채움용. 실제 사용 미확인 |
| fill/primary-hover | #E6007E | pink/600 | Primary 버튼 Hover |
| fill/accent | #E6007E | pink/600 | 강조 채움용. 실제 사용 미확인 |

fill/accent와 fill/primary-hover의 값은 같다.
상태를 나타내는 Hover와 일반 강조 역할을 혼동하지 않는다.

### 1.6 아이콘·브랜드·효과

| Semantic 토큰 | 값 | Primitive 참조 | 쓰는 곳 |
|---|---|---|---|
| icon/default | #66707A | gray/600 | 뒤로가기 등 기본 아이콘의 도형·선 |
| icon/strong | #181A1B | gray/900 | 강한 아이콘용. 실제 사용 미확인 |
| icon/on-dark | #FFFFFF | gray/0 | 완료 표시 내부의 흰색 아이콘 등 |
| icon/disabled | #D9DCDF | gray/300 | 비활성 아이콘용. 실제 사용 미확인 |
| icon/error | #E30036 | red/500 | Input 오류 메시지 아이콘 |
| icon/primary | #000000 | gray/950 | 검정 아이콘용. 실제 사용 미확인 |
| icon/accent | #FF2E98 | pink/500 | List/Row check 표시 및 일부 할인·프로모션 Chip 라벨 |
| brand/primary | #FF2E98 | pink/500 | Logo |
| effect/shadow-subtle | rgba(0, 0, 0, 0.05) | 직접 정의 | 그림자 색상용. 색상만 정의되어 있으며 이 토큰만으로 blur·offset·spread를 결정할 수 없음 |

### 1.7 적용 규칙

- 권장: 새 UI에는 색상 값 직접 입력보다 역할에 맞는 semantic 토큰을 사용한다.
- 확인: 선택 상태는 항상 분홍색 배경으로 표현되지 않는다.
  - Card/Plan: 회색 테두리 강화.
  - OptionItem: 연회색 배경과 회색 테두리, 분홍색 라디오 표시.
  - FilterChip: 진한 회색 배경과 흰색 라벨.
- 확인: 일부 Chip 텍스트에 icon/accent가 적용되어 있다. 현재 바인딩과 역할상 권장 토큰을 구분해 관리한다.
- 권장: 오류·비활성 상태는 색상만 바꾸지 말고 해당 컴포넌트의 상태 변형을 사용한다.

## 2. 타이포 스케일

### 2.1 기본 정의

- 글꼴: Noto Sans KR
- 글꼴 변수: font-family/family-font
- 모든 로컬 텍스트 스타일의 자간: 0%
- 모든 로컬 텍스트 스타일의 줄높이: 고정 px
- 굵기 대응:
  - Medium: 500
  - SemiBold: 600
  - Bold: 700

다음 표의 크기·줄높이·굵기는 개별 텍스트의 오버라이드가 아닌 텍스트 스타일 정의를 기준으로 한다.

### 2.2 텍스트 스타일

| 텍스트 스타일 | 크기 / 줄높이 | 굵기 | 쓰는 곳 |
|---|---:|---|---|
| heading/h1 | 32 / 44 | Bold 700 | 최상위 제목용 권장. Components 내 일반 UI 적용 미확인 |
| heading/h2 | 28 / 40 | Bold 700 | 가격 요약의 큰 금액 |
| heading/h3 | 24 / 32 | Bold 700 | 주요 섹션 제목용 권장. Components 내 적용 미확인 |
| heading/h4 | 20 / 28 | Bold 700 | Header root 제목 |
| subtitle/bold | 18 / 26 | Bold 700 | Card/Plan 이름·가격·할인율, BottomCTA 금액, 선택된 OptionItem 제목 |
| subtitle/default | 18 / 26 | SemiBold 600 | Header default의 가운데 제목 |
| body/strong | 16 / 24 | SemiBold 600 | Input 값, 버튼 라벨, OptionItem 기본 제목 등에 연결됨. 일부 실제 굵기 오버라이드 존재 |
| body/medium | 16 / 24 | Medium 500 | 비활성 Primary 버튼 라벨 등 |
| body/small-strong | 14 / 21 | SemiBold 600 | List/Row 값, 선택된 FilterChip 라벨 등에 연결됨 |
| body/small-medium | 14 / 21 | Medium 500 | 카드 설명, List/Row 라벨, Input 오류 메시지, 기본 FilterChip 라벨 |
| caption/medium | 13 / 18 | Medium 500 | 정가, 가격 요약의 보조 정보 |
| caption/bold | 13 / 18 | Bold 700 | 추천 Tag, 할인·프로모션 Chip, 단계 표시 |
| caption/small | 12 / 16 | Medium 500 | 작은 보조 정보용 권장. Components 내 적용 미확인 |
| caption/small-bold | 12 / 16 | Bold 700 | 작은 강조 정보용 권장. Components 내 적용 미확인 |
| caption/mini | 10 / 14 | SemiBold 600 | benefit·package Chip |
| specimen/weight-medium | 32 / 44 | Medium 500 | 굵기 비교용 견본 스타일 |
| specimen/weight-semibold | 32 / 44 | SemiBold 600 | 굵기 비교용 견본 스타일 |

specimen 계열은 일반 UI의 제목 단계가 아니라 굵기 견본으로 구분한다.

### 2.3 크기 변수 연결

| Typography 변수 | 값 | 대응 스타일 |
|---|---:|---|
| font-size/heading-h1 | 32 | heading/h1 |
| font-size/heading-h2 | 28 | heading/h2 |
| font-size/heading-h3 | 24 | heading/h3 |
| font-size/heading-h4 | 20 | heading/h4 |
| font-size/subtitle | 18 | subtitle/* |
| font-size/body | 16 | body/strong, body/medium |
| font-size/body-small | 14 | body/small-* |
| font-size/caption | 13 | caption/medium, caption/bold |
| font-size/12 | 12 | caption/small, caption/small-bold |
| font-size/caption-mini | 10 | caption/mini |

### 2.4 적용 규칙과 예외

- 권장: 크기만 맞추지 말고 줄높이·굵기를 포함한 텍스트 스타일을 적용한다.
- 권장: 설명과 보조 정보는 body/small-medium 또는 caption 계열을 사용하고, 가격·선택 상태의 강조는 해당 컴포넌트 정의를 따른다.
- 확인: 일부 body/strong 연결 텍스트는 실제 글꼴이 Regular 400으로 오버라이드되어 있다.
  - Card/Plan 내부 버튼 라벨.
  - OptionItem default 제목.
- 확인: FilterChip selected 라벨은 body/small-strong에 연결되어 있지만 실제 글꼴은 Regular 400이다.
- 확인: Input default의 숨겨진 메시지에는 heading/h4가 연결되어 있고, 다른 상태의 메시지는 body/small-medium을 사용한다.
- 권장: 새 구현은 위 스타일 정의를 기준으로 한다. 기존 화면의 픽셀 재현이 목적이면 오버라이드를 별도 예외로 확인한다.

## 3. 간격·레이아웃

### 3.1 390×844 모바일 기준

| 항목 | 확인된 값 | 적용 |
|---|---:|---|
| 기준 화면 | 390 × 844 | 모바일 화면 예시 |
| Header | 390 × 56 | 화면 상단 |
| 기본 컴포넌트 좌우 여백 | 16 | Header, BottomCTA, 358 폭의 본문 컴포넌트 기준 |
| 기본 콘텐츠 폭 | 358 | 390 − 16 × 2 |
| 화면 예시의 대체 좌우 여백 | 24 | 목록·상세 본문 및 일부 하단 동작 영역 |
| 대체 콘텐츠 폭 | 342 | 390 − 24 × 2 |
| 기본 세로 간격 | 16 또는 24 | 화면별 본문 그룹 |
| BottomCTA single·double | 높이 97 | 하단 액션 영역 |
| BottomCTA price | 높이 139 | 금액과 버튼을 함께 표시 |
| BottomCTA 하단 여백 | 32 | 컴포넌트 설명상 홈 인디케이터 영역 |

16px와 24px 여백이 모두 존재한다.
전체 화면이 하나의 여백 규칙으로 통일되어 있다고 가정하지 않는다.

### 3.2 확인된 화면별 배치

| 화면 | 본문 패딩: 위 / 오른쪽 / 아래 / 왼쪽 | 본문 간격 | 하단 구성 |
|---|---|---:|---|
| 요금제 목록 | 16 / 24 / 16 / 24 | 16 | 본문이 화면 높이를 초과하는 예시 |
| 요금제 상세 | 24 / 24 / 24 / 24 | 24 | 버튼 2개를 세로로 배치한 별도 영역, 높이 160 |
| 구독 신청 | 16 / 16 / 16 / 16 | 16 | 버튼 2개를 세로로 배치한 별도 영역, 높이 152 |
| 신청 완료 | 16 / 16 / 16 / 16 | 24 | BottomCTA single, 높이 97 |

- 상세·신청 화면의 세로 버튼 2개 구성은 BottomCTA double과 다르다.
- BottomCTA double은 두 버튼을 가로로 배치한다.
- 목록 예시의 내부 콘텐츠 높이는 873으로 기준 화면 높이 844보다 크다.
- 구독 신청 예시의 하단 영역은 화면 끝까지 정확히 맞지 않고 5px 여백이 남는다.
- 권장: 이 차이를 공통 규칙으로 확대하지 말고 화면별 예외로 취급한다.
- 권장: 긴 본문은 세로 스크롤을 전제로 하고, 하단 액션에 마지막 콘텐츠가 가려지지 않도록 공간을 확보한다.
- 상태 표시줄·상단 safe area의 공통 높이는 이번 기준에서 확인되지 않았다. Header 높이 56과 혼합하지 않는다.

### 3.3 간격 토큰

spacing 컬렉션에는 다음 토큰이 정의되어 있다.

| 토큰 | 값 | 확인된 용도 |
|---|---:|---|
| spacing/0 | 0 | 여백·간격 제거 |
| spacing/2 | 2 | Input 내부의 미세한 좌측 여백 |
| spacing/4 | 4 | 메시지 아이콘과 텍스트 간격, Chip 상하 패딩, Header 상하 패딩 |
| spacing/6 | 6 | benefit·package Chip 좌우 패딩 |
| spacing/8 | 8 | 카드 내부 간격, BottomCTA 버튼 간격, 작은 Button 상하 패딩 |
| spacing/10 | 10 | Input 내부 간격, sale Chip 좌우 패딩 |
| spacing/12 | 12 | Input 메시지 간격, List/Row 간격·상하 패딩, BottomCTA 상단 패딩 |
| spacing/16 | 16 | 기본 화면 좌우 여백, xl Button 상하 패딩, OptionItem 상하 패딩 |
| spacing/20 | 20 | Card/Plan 내부 패딩, OptionItem 좌우 패딩 |
| spacing/24 | 24 | Button 좌우 패딩, 일부 화면 본문 패딩·그룹 간격 |
| spacing/28 | 28 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/32 | 32 | BottomCTA 하단 여백 |
| spacing/40 | 40 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/48 | 48 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/56 | 56 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/60 | 60 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/64 | 64 | 정의됨. 조사한 Components 내부 사용 미확인 |
| spacing/80 | 80 | 정의됨. 조사한 Components 내부 사용 미확인 |

높이가 40·48·56·64라는 이유만으로 해당 spacing 토큰이 그 높이에 바인딩되어 있다고 해석하지 않는다.

### 3.4 모서리 토큰

| 토큰 | 값 | 확인된 용도 |
|---|---:|---|
| radius/0 | 0 | Header, Input, List/Row 등 |
| radius/2 | 2 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/4 | 4 | benefit·package Chip |
| radius/5 | 5 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/6 | 6 | sale Chip |
| radius/8 | 8 | Button |
| radius/10 | 10 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/12 | 12 | OptionItem, 가격 요약 패널 |
| radius/16 | 16 | Card/Plan |
| radius/20 | 20 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/24 | 24 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/32 | 32 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/40 | 40 | 정의됨. 조사한 Components 내부 사용 미확인 |
| radius/999 | 999 | Tag |
| radius/full | 9999 | FilterChip, 완료 표시 |

radius/999와 radius/full은 별개 토큰이다.

### 3.5 크기와 리사이징

- 확인: Input, Card/Plan, OptionItem, List/Row, StepProgress의 원본 폭은 358이다.
- 권장: 이 폭을 모든 화면에 고정하지 말고 부모 콘텐츠 폭에 맞춘다.
  - 좌우 16 여백이면 358.
  - 좌우 24 여백이면 342.
- 권장: 카드·설명·오류 메시지 높이는 텍스트 길이에 따라 늘어날 수 있게 한다.
- 권장: 기준 화면보다 작거나 큰 화면에서는 폭과 콘텐츠 흐름을 조정한다. 390×844를 전체 UI의 비례 확대·축소 기준으로 사용하지 않는다.
- 확인: 상태 변경 시 일부 컴포넌트 높이가 달라진다.
  - Input: 58 → 오류 메시지 포함 시 91.
  - Card/Plan: 223 → selected 224.
  - OptionItem: 83 → selected 86.
- 권장: 상태 변경으로 인접 요소가 겹치지 않도록 세로 흐름 안에서 배치한다.

## 4. 컴포넌트 용법

Components 섹션 기준으로 11개 컴포넌트 세트와 5개 단일 컴포넌트가 있다.

아래 속성명은 표시 이름 기준이다. Figma 내부 식별용 접미사는 생략한다.
별도 언급이 없으면 나열된 속성만 공개 속성으로 확인되었다.

### 4.1 Button

변형:
- Type: Primary / Secondary
- Size: sm / lg / xl
- State: Default / Hover / Disabled
- 총 18개 조합이 정의되어 있다.

기본값:
- Type = Primary
- Size = xl
- State = Default
- Label = "로그인"

공개 속성:
- Label: TEXT

크기:
| Size | 원본 높이 | 상하 패딩 | 좌우 패딩 |
|---|---:|---:|---:|
| sm | 40 | 8 | 24 |
| lg | 48 | 12 | 24 |
| xl | 52 | 16 | 24 |

예외:
- Secondary sm의 Default·Hover 원본 높이는 42다.
- 원본 버튼 폭은 예시 라벨에 따른 값이며, 화면용 고정 폭이 아니다.
- xl은 원본 높이 52와 상하 패딩 16이 함께 설정되어 있다. 패딩과 줄높이의 단순 합으로 높이를 재계산하지 않는다.

상태 표현:
- Primary Default: fill/primary + text/on-dark.
- Primary Hover: fill/primary-hover.
- Secondary Default: surface/default + border/default + text/primary.
- Secondary Hover: bg/subtle + border/default.
- Disabled: fill/disabled 배경. 현재 라벨은 text/on-dark를 사용한다.

사용 규칙:
- 권장: 주요 동작은 Primary, 보조 동작은 Secondary로 구분한다.
- 권장: 모바일 하단의 주 동작에는 실제 예시처럼 xl을 사용한다.
- Disabled는 별도 변형으로 사용하며 임의 투명도만 적용하지 않는다.
- 현재 컴포넌트에는 로딩·아이콘 전용 변형이 없다.

### 4.2 Input

변형:
- State: default / focus / filled / caution / disabled
- 기본값: default

공개 속성:
- errorMessage: BOOLEAN, 기본값 false

구조:
- 원본 폭 358.
- 기본 입력 영역 높이 58.
- caution 원본 전체 높이 91.
- 입력 영역과 메시지 간격 12.
- 직사각형 박스형이 아닌 하단 선 중심의 입력 표현이다.

상태 표현:
- default: text/placeholder, border/default.
- focus: border/focus.
- filled: 입력 값에 text/primary.
- caution: border/error, icon/error, text/error.
- disabled: bg/subtle, text/on-disabled.

사용 규칙:
- 입력 전·입력 중·입력 완료·오류·비활성 상태를 구분한다.
- 오류 메시지를 표시할 때 하단 높이 증가를 수용한다.
- State와 errorMessage는 서로 다른 속성이다. 오류 표현 시 상태와 메시지 표시를 함께 확인한다.
- 입력 값·플레이스홀더·오류 문구의 TEXT 공개 속성은 정의되어 있지 않다. 해당 문구는 내부 텍스트 오버라이드 대상이다.
- 현재 정의에는 별도 라벨·도움말·성공 상태 변형이 없다.

### 4.3 Checkbox

변형:
- State: default / active
- 기본값: default

크기:
- 24 × 24.

사용 규칙:
- default는 미선택, active는 선택 표현이다.
- active의 주요 채움은 fill/primary다.
- 공개된 라벨 속성은 없다. 설명은 외부 텍스트와 함께 구성한다.
- disabled·indeterminate 변형은 정의되어 있지 않다.
- 권장: 단일 선택 질문에는 Checkbox 대신 OptionItem을 사용한다.

### 4.4 Header

변형:
- Type: default / root
- 기본값: default

공개 속성:
- Title: TEXT
- 기본값: "맞춤 요금제 추천"

크기:
- 390 × 56.
- 좌우 패딩 16, 상하 패딩 4.

사용 규칙:
- default:
  - 뒤로가기 아이콘 + 가운데 제목.
  - 제목은 subtitle/default.
  - 좌우 균형을 위한 우측 spacer가 있다.
- root:
  - 서비스 첫 화면용.
  - 뒤로가기 없이 왼쪽 큰 제목과 오른쪽 Logo.
  - 제목은 heading/h4.
- 배경은 bg/surface를 사용한다.
- 뒤로가기 노출 여부는 별도 Boolean이 아니라 Type으로 결정한다.

### 4.5 BottomCTA

변형:
- Layout: single / double / price
- 기본값: single

공개 속성:
- Amount: TEXT, 기본값 "월 85,000원"
- AmountLabel: TEXT, 기본값 "월 납부 금액"

구조:
| Layout | 원본 크기 | 패딩: 위 / 오른쪽 / 아래 / 왼쪽 | 간격 |
|---|---|---|---:|
| single | 390 × 97 | 12 / 16 / 32 / 16 | 8 |
| double | 390 × 97 | 12 / 16 / 32 / 16 | 8 |
| price | 390 × 139 | 16 / 16 / 32 / 16 | 12 |

사용 규칙:
- single: 폭 358, 높이 52의 Primary 버튼 1개.
- double: Secondary와 Primary 버튼을 가로 배치한다.
  - 원본 폭은 각각 약 132.7과 217.3.
  - 두 버튼 사이 간격은 8.
- price: 금액 정보 행 다음에 Primary 버튼을 배치한다.
- 하단 패딩 32는 컴포넌트 설명상 홈 인디케이터 공간이다.
- 버튼 문구는 상위 BottomCTA의 공개 속성이 아니라 내부 Button의 Label로 변경한다.
- 화면 예시의 세로 버튼 2개 영역을 double 변형과 혼동하지 않는다.
- 권장: 하단 액션 영역과 본문 영역을 분리해 긴 본문이 버튼에 가려지지 않도록 한다.

### 4.6 Card/Plan

변형:
- State: default / selected
- 기본값: default

공개 TEXT 속성:
| 속성 | 기본값 |
|---|---|
| Name | 넉넉 무제한 |
| Desc | 데이터 무제한 · 통화 무제한 · 넷플릭스 포함 |
| Discount | 15% |
| Price | 월 85,000원 |
| Original | 월 100,000원 |

공개 BOOLEAN 속성:
| 속성 | 기본값 | 역할 |
|---|---|---|
| Badge | true | 추천 배지 표시 |
| Promo | true | 프로모션 표시 |
| Sale | true | 할인 관련 표시 |

구조:
- 원본 폭 358.
- default 높이 223, selected 높이 224.
- 패딩 20, 내부 간격 8.
- 모서리 radius/16.
- 이름·설명·가격·선택적 배지/할인/프로모션·내부 버튼으로 구성된다.

상태 표현:
- default: bg/surface + border/default, 선 두께 1.
- selected: bg/surface + border/medium, 선 두께 1.5.
- selected 내부 버튼 문구는 "선택됨"이다.

사용 규칙:
- 요금제 목록·추천 결과에 사용한다.
- 기본 카드가 필요하면 컴포넌트 설명에 따라 Sale·Promo·Badge를 모두 끈다.
- Name·Desc·Price는 실제 요금제 데이터에 맞춰 함께 변경한다.
- 할인율·현재 가격·정가·프로모션 조건의 정합성을 유지한다.
- 권장: 선택형 목록에서는 외부 상태와 State를 일치시킨다.
- 이 컴포넌트 설명에는 전체 목록의 단일 선택 제한이 명시되어 있지 않다. 선택 개수 규칙은 사용 화면에서 결정한다.
- 실제 콘텐츠와 표시 옵션에 따라 카드 높이가 달라질 수 있다.

### 4.7 List/Row

변형:
- Type: default / check
- 기본값: default

공개 속성:
- Label: TEXT, 기본값 "데이터"
- Value: TEXT, 기본값 "무제한"

구조:
- 원본 358 × 46.
- 상하 패딩 12, 좌우 패딩 4.
- 내부 간격 12.
- border/subtle 구분선.

사용 규칙:
- default: 라벨과 값을 표시하는 정보 행.
- check: 체크 표시를 포함하는 혜택 목록 행.
- 기본 라벨은 text/secondary.
- default 값은 text/primary.
- check 값과 체크 표시는 강조 토큰을 사용한다.
- 양식 입력이나 선택 컨트롤 대신 사용하지 않는다.

### 4.8 OptionItem

변형:
- State: default / selected
- 기본값: default

공개 속성:
- Title: TEXT, 기본값 "데이터를 많이 써요"
- Desc: TEXT, 기본값 "영상·게임을 자주 봐서 무제한이 필요해요"

구조:
- 원본 폭 358.
- default 높이 83, selected 높이 86.
- 상하 패딩 16, 좌우 패딩 20.
- 내부 간격 12.
- 모서리 radius/12.
- 오른쪽 라디오 표시 22 × 22.

상태 표현:
- default: bg/surface + border/default, 선 두께 1.
- selected: bg/default + border/medium, 선 두께 1.5.
- selected 라디오 채움: fill/primary.
- selected 제목: subtitle/bold.

사용 규칙:
- 질문형 추천처럼 하나를 고르는 흐름에 사용한다.
- 같은 선택 그룹의 selected는 한 번에 1개다.
- 선택 상태에서 제목 크기와 전체 높이가 변하므로 주변 배치가 변화를 수용해야 한다.
- 다중 선택용으로 사용하지 않는다.

### 4.9 FilterChip

변형:
- State: default / selected
- 기본값: default

공개 속성:
- Label: TEXT, 기본값 "데이터 많이"

구조:
- 높이 40.
- 상하 패딩 8, 좌우 패딩 16.
- 모서리 radius/full.
- 폭은 라벨에 따라 달라진다.

상태 표현:
- default: bg/surface + border/default + text/primary.
- selected: fill/secondary + text/on-dark.
- 선택 상태도 회색조를 유지한다.

사용 규칙:
- 조건·정렬 선택에 사용한다.
- 같은 선택 그룹의 selected는 한 번에 1개다.
- Chip과 달리 선택 상태를 가진 컨트롤이다.
- 현재 정의에는 disabled 변형이 없다.

### 4.10 StepProgress

변형:
- Step: 1 / 2 / 3
- 기본값: 1

구조:
- 원본 358 × 30.
- 라벨과 트랙 사이 간격 8.
- 트랙 높이 4.
- 라벨은 caption/bold, text/accent.
- 트랙 배경은 bg/subtle.

사용 규칙:
- 질문·입력이 3단계로 나뉜 흐름에 사용한다.
- 실제 단계와 Step 값을 일치시킨다.
- 라벨은 각 변형에서 "STEP 1 / 3", "STEP 2 / 3", "STEP 3 / 3"으로 정의되어 있다.
- 전체 단계 수를 변경하는 공개 속성은 없다.
- 3단계가 아닌 흐름은 현재 정의만으로 지원된다고 가정하지 않는다.

### 4.11 Chip

변형:
- Type: benefit / package / sale
- 기본값: sale

| Type | 원본 높이 | 패딩: 상하 / 좌우 | 모서리 | 표현 |
|---|---:|---|---|---|
| benefit | 20 | 4 / 6 | radius/4 | bg/subtle + text/primary, caption/mini |
| package | 20 | 4 / 6 | radius/4 | fill/secondary + text/on-dark, caption/mini |
| sale | 24 | 4 / 10 | radius/6 | bg/accent-subtle + icon/accent, caption/bold |

사용 규칙:
- 혜택·패키지·할인 정보를 나타내는 보조 배지다.
- 선택 상태를 가진 FilterChip과 구분한다.
- 공개된 Label TEXT 속성은 없다. 문구는 내부 텍스트 오버라이드로 변경한다.
- 원본 높이와 패딩·줄높이 합이 일치하지 않는 변형이 있으므로 높이를 단순 합산해 재계산하지 않는다.

### 4.12 Tag

형태:
- 단일 컴포넌트.
- 원본 48 × 26.
- 모서리 radius/999.
- 배경 border/subtle.
- 라벨 caption/bold, text/secondary.
- 기본 문구 "추천".

사용 규칙:
- 요금제 추천 배지에 사용한다.
- 변형과 공개 속성은 없다.
- 상태 선택이나 액션 버튼으로 사용하지 않는다.

### 4.13 아이콘과 Logo

| 컴포넌트 | 원본 크기 | 용도 |
|---|---|---|
| icon/arrowLeft | 24 × 24 | Header default의 뒤로가기 표시 |
| icon/check | 24 × 24 | 확인·혜택 표시 |
| icon/doneMark | 64 × 64 | 신청 완료 등 결과 표시 |
| Logo | 32 × 24 | Header root의 브랜드 표시 |

사용 규칙:
- 네 컴포넌트 모두 변형과 공개 속성이 없다.
- icon/doneMark는 fill/primary 배경과 흰색 내부 표시를 사용한다.
- Logo는 brand/primary를 사용한다.
- 권장: 화면별로 유사한 도형을 새로 만들기보다 기존 컴포넌트를 재사용한다.
- 원본 크기는 시각 요소의 크기이며, 별도의 터치 영역 규칙이 정의되어 있다는 뜻은 아니다.

### 4.14 공통 적용 원칙

- 권장: 인스턴스를 유지하고 공개 속성과 정의된 변형을 우선 사용한다.
- 공개 속성이 없는 문구는 내부 텍스트 오버라이드로 변경하되, 반복적으로 필요하면 속성 확장을 별도 설계한다.
- 변형 이름은 컴포넌트별로 대소문자가 다르다.
  - Button: Default / Hover / Disabled.
  - Input 등: default / focus / selected 등.
- 존재하지 않는 loading·success·disabled·다중 선택 상태를 현재 정의에 포함된 것으로 가정하지 않는다.
- 시각적 상태 정의만으로 클릭 동작·검증 로직·화면 이동이 구현되어 있다고 해석하지 않는다.
- Components 섹션 밖의 유사 이름 컴포넌트는 이 문서의 표준 목록에 포함하지 않는다.
