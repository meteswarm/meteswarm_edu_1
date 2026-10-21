# tokens.md — 디자인 토큰 설명 (기획자용)

`tokens.json`에 기획자가 읽을 수 있는 한국어 주석을 단 문서입니다. 원본 `tokens.json`은 바꾸지 않았습니다.

- **토큰:** 화면에 쓰는 색, 글자 크기, 여백, 모서리 둥글기에 이름을 붙여 둔 값입니다.
- **두 단계 구조:** 색은 먼저 "실제 색 모음(primitive)"이 있고, 이것을 "어디에 쓰는 색인지 정한 이름(semantic)"이 가져다 씁니다. 예: `gray/900`(실제 색) → `text/primary`(주요 글자색).
- **값 단위:** 숫자는 따로 적지 않으면 px입니다.

주석 머리말: `[영역]` 묶음 설명 · `[조건]` 상태별로 쓰는 경우 · `[근거]` 문서 출처 · `[확인 필요]` 문서로 확인되지 않음

```jsonc
// [영역] 토큰 전체 — 색(primitive, semantic), 글자(typography), 여백(spacing), 모서리(radius) 다섯 묶음
// [근거] design.md 1~3장
{
  // [영역] 실제 색 모음(primitive) — 화면에 직접 쓰지 않고, 아래 역할별 색이 가져다 씀
  // [근거] design.md 1.1 토큰 구조
  "primitive": {
    // [영역] 회색 단계 — 숫자가 클수록 진함 (950 검정 ~ 0 흰색)
    "gray/950": { "hex": "#000000" },
    "gray/900": { "hex": "#181A1B" },
    "gray/800": { "hex": "#2D2D2D" },
    "gray/600": { "hex": "#66707A" },
    "gray/500": { "hex": "#878787" },
    "gray/400": { "hex": "#B7BDC4" },
    "gray/300": { "hex": "#D9DCDF" },
    "gray/200": { "hex": "#EFF1F3" },
    "gray/100": { "hex": "#F7F7F7" },
    "gray/0": { "hex": "#FFFFFF" },
    // [영역] 분홍(브랜드 색) 단계 — 500이 기본 분홍, 600은 더 진한 분홍, 50·25는 아주 연한 분홍
    "pink/500": { "hex": "#FF2E98" },
    "pink/600": { "hex": "#E6007E" },
    "pink/50": { "hex": "#FFF5FA" },
    // [확인 필요] pink/25는 아래 역할별 색 어디에서도 쓰지 않고, design.md에도 설명이 없음
    "pink/25": { "hex": "#FFF8F5" },
    // [영역] 빨강(오류) 단계 — 500은 오류 글자·선, 50은 연한 오류 배경
    "red/500": { "hex": "#E30036" },
    "red/50": { "hex": "#FFF0F3" },
    // [영역] 10% 투명한 검정 — 구분선용
    "black/10": {
      "hex": "#0000001A",
      "alpha": 0.1
    }
  },
  // [영역] 역할별 색(semantic) — 화면에서는 이 이름을 씀. 이름 앞부분이 쓰는 곳 (text 글자, bg 배경, border 테두리, fill 채움, icon 아이콘)
  // [근거] design.md 1.2~1.7
  // [조건] 값이 같은 색이라도 역할이 다르면 다른 토큰으로 구분해서 씀 (예: text/accent와 icon/accent)
  "semantic": {
    // [확인 필요] fill/accent(강조 채움)는 실제로 쓰인 곳이 확인되지 않음. 값은 fill/primary-hover와 같지만 역할이 다름
    "fill/accent": {
      "hex": "#E6007E",
      "primitive": "pink/600"
    },
    // [영역] 분홍 강조 — 글자: 할인율·단계 표시·혜택 강조 값 / 아이콘: 체크 표시·일부 할인 칩 글자
    "text/accent": {
      "hex": "#FF2E98",
      "primitive": "pink/500"
    },
    "icon/accent": {
      "hex": "#FF2E98",
      "primitive": "pink/500"
    },
    // [영역] 글자색 — primary 제목·주요 정보 / secondary 설명·라벨 / tertiary 정가 같은 낮은 강조 / on-dark 분홍·검정 버튼 위 흰 글자
    "text/primary": {
      "hex": "#181A1B",
      "primitive": "gray/900"
    },
    "text/secondary": {
      "hex": "#66707A",
      "primitive": "gray/600"
    },
    "text/tertiary": {
      "hex": "#878787",
      "primitive": "gray/500"
    },
    "text/on-dark": {
      "hex": "#FFFFFF",
      "primitive": "gray/0"
    },
    // [조건] 입력 오류일 때 오류 메시지 글자색
    "text/error": {
      "hex": "#E30036",
      "primitive": "red/500"
    },
    // [조건] 입력 전 안내 문구(예: "이름을 입력하세요")의 흐린 글자색
    "text/placeholder": {
      "hex": "#B7BDC4",
      "primitive": "gray/400"
    },
    // [조건] 입력란을 쓸 수 없는 상태일 때 글자색
    "text/on-disabled": {
      "hex": "#66707A",
      "primitive": "gray/600"
    },
    // [영역] 배경색 — surface 흰 기본 바탕(헤더·하단 버튼 영역·요금제 카드) / default 연회색(가격 요약, 선택된 선택지) / subtle 더 연한 회색(비활성 입력란, 혜택 칩)
    "bg/surface": {
      "hex": "#FFFFFF",
      "primitive": "gray/0"
    },
    "bg/default": {
      "hex": "#F7F7F7",
      "primitive": "gray/100"
    },
    "bg/subtle": {
      "hex": "#EFF1F3",
      "primitive": "gray/200"
    },
    // [확인 필요] bg/inverse(어두운 반전 배경)는 실제로 쓰인 곳이 확인되지 않음
    "bg/inverse": {
      "hex": "#2D2D2D",
      "primitive": "gray/800"
    },
    // [영역] 할인·프로모션 칩의 연분홍 배경
    "bg/accent-subtle": {
      "hex": "#FFF5FA",
      "primitive": "pink/50"
    },
    // [확인 필요] bg/error-subtle(연한 오류 배경)은 실제로 쓰인 곳이 확인되지 않음
    "bg/error-subtle": {
      "hex": "#FFF0F3",
      "primitive": "red/50"
    },
    // [영역] 테두리색 — default 입력란·흰 버튼·카드·필터 칩의 기본 테두리 / subtle 목록 행과 하단 버튼 영역의 옅은 구분선
    "border/default": {
      "hex": "#D9DCDF",
      "primitive": "gray/300"
    },
    "border/subtle": {
      "hex": "#EFF1F3",
      "primitive": "gray/200"
    },
    // [확인 필요] border/strong(진한 테두리)은 실제로 쓰인 곳이 확인되지 않음
    "border/strong": {
      "hex": "#181A1B",
      "primitive": "gray/900"
    },
    // [영역] 구분선 — 10% 투명한 검정
    "border/divider": {
      "hex": "#0000001A",
      "alpha": 0.1,
      "primitive": "black/10"
    },
    // [조건] 입력란을 누르고 입력 중일 때 분홍 선
    "border/focus": {
      "hex": "#FF2E98",
      "primitive": "pink/500"
    },
    // [조건] 입력 오류일 때 빨간 선
    "border/error": {
      "hex": "#E30036",
      "primitive": "red/500"
    },
    // [영역] 채움색 — primary 분홍 주요 버튼·체크된 체크박스·완료 표시 / secondary 검정(선택된 필터 칩, 패키지 칩)
    "fill/primary": {
      "hex": "#FF2E98",
      "primitive": "pink/500"
    },
    "fill/secondary": {
      "hex": "#181A1B",
      "primitive": "gray/900"
    },
    // [확인 필요] fill/tertiary(3차 채움)는 실제로 쓰인 곳이 확인되지 않음
    "fill/tertiary": {
      "hex": "#EFF1F3",
      "primitive": "gray/200"
    },
    // [조건] 버튼을 누를 수 없는 상태일 때 회색 배경
    "fill/disabled": {
      "hex": "#D9DCDF",
      "primitive": "gray/300"
    },
    // [확인 필요] fill/disabled-strong(더 진한 비활성 채움)은 실제로 쓰인 곳이 확인되지 않음
    "fill/disabled-strong": {
      "hex": "#B7BDC4",
      "primitive": "gray/400"
    },
    // [조건] 분홍 주요 버튼 위에 마우스를 올렸을 때 더 진한 분홍
    "fill/primary-hover": {
      "hex": "#E6007E",
      "primitive": "pink/600"
    },
    // [영역] 기본 아이콘색 — 뒤로가기 화살표 등
    "icon/default": {
      "hex": "#66707A",
      "primitive": "gray/600"
    },
    // [확인 필요] icon/strong(진한 아이콘)은 실제로 쓰인 곳이 확인되지 않음
    "icon/strong": {
      "hex": "#181A1B",
      "primitive": "gray/900"
    },
    // [조건] 선택된 요금제 카드·선택지의 진해진 테두리
    "border/medium": {
      "hex": "#66707A",
      "primitive": "gray/600"
    },
    // [영역] 흰 보조 버튼의 기본 배경 — bg/surface와 값은 같지만 다른 토큰이므로 합치지 않음
    "surface/default": {
      "hex": "#FFFFFF",
      "primitive": "gray/0"
    },
    // [영역] 분홍 완료 표시 안의 흰 체크 아이콘
    "icon/on-dark": {
      "hex": "#FFFFFF",
      "primitive": "gray/0"
    },
    // [확인 필요] icon/disabled(비활성 아이콘)는 실제로 쓰인 곳이 확인되지 않음
    "icon/disabled": {
      "hex": "#D9DCDF",
      "primitive": "gray/300"
    },
    // [조건] 입력 오류일 때 오류 메시지 앞 아이콘
    "icon/error": {
      "hex": "#E30036",
      "primitive": "red/500"
    },
    // [확인 필요] icon/primary(검정 아이콘)는 실제로 쓰인 곳이 확인되지 않음
    "icon/primary": {
      "hex": "#000000",
      "primitive": "gray/950"
    },
    // [영역] 브랜드 색 — 헤더의 U+ 로고
    "brand/primary": {
      "hex": "#FF2E98",
      "primitive": "pink/500"
    },
    // [영역] 옅은 그림자 색(5% 투명한 검정) — 실제 색 모음을 거치지 않고 직접 정한 값
    // [확인 필요] 그림자의 번짐 정도·위치는 이 토큰에 없음. 색만 정해져 있음
    "effect/shadow-subtle": {
      "hex": "#0000000D",
      "alpha": 0.05,
      "primitive": null
    }
  },
  // [영역] 글자 — 글꼴과 글자 크기
  // [근거] design.md 2장 타이포 스케일
  // [확인 필요] 줄 간격과 굵기는 이 파일에 없음. design.md 2.2 텍스트 스타일 표를 함께 봐야 함
  "typography": {
    // [영역] 글꼴 — 모든 글자에 Noto Sans KR 사용
    "font-family/family-font": "Noto Sans KR",
    // [영역] 제목 크기 — h1(32)이 가장 크고 h4(20)가 가장 작음. h2는 가격 요약의 큰 금액, h4는 첫 화면 헤더 제목
    "font-size/heading-h1": 32,
    "font-size/heading-h2": 28,
    "font-size/heading-h3": 24,
    "font-size/heading-h4": 20,
    // [영역] 본문 크기 — subtitle 18 카드 이름·가격 / body 16 버튼·입력 값 / body-small 14 설명·라벨
    "font-size/subtitle": 18,
    "font-size/body": 16,
    "font-size/body-small": 14,
    // [영역] 작은 글자 — caption 13 정가·추천 태그·할인 칩 / caption-mini 10 혜택·패키지 칩 / 12 작은 보조 정보
    "font-size/caption": 13,
    "font-size/caption-mini": 10,
    "font-size/12": 12
  },
  // [영역] 여백 — 요소 사이 간격과 안쪽 여백. 이름의 숫자가 곧 px 값
  // [근거] design.md 3.3 간격 토큰
  // [조건] 화면 좌우 여백은 16(기본)과 24(목록·상세 화면) 두 가지가 함께 쓰임
  // [확인 필요] 28, 40, 48, 56, 60, 64, 80은 정의만 되어 있고 실제로 쓰인 곳이 확인되지 않음
  "spacing": {
    "spacing/4": 4,
    "spacing/8": 8,
    "spacing/12": 12,
    "spacing/16": 16,
    "spacing/20": 20,
    "spacing/24": 24,
    "spacing/32": 32,
    "spacing/40": 40,
    "spacing/48": 48,
    "spacing/80": 80,
    "spacing/10": 10,
    "spacing/0": 0,
    "spacing/2": 2,
    "spacing/6": 6,
    "spacing/56": 56,
    "spacing/64": 64,
    "spacing/28": 28,
    "spacing/60": 60
  },
  // [영역] 모서리 둥글기 — 숫자가 클수록 더 둥금. 버튼 8, 선택지·가격 요약 12, 요금제 카드 16
  // [근거] design.md 3.4 모서리 토큰
  // [조건] full(9999)과 999는 완전히 둥근 알약 모양. full은 필터 칩·완료 표시, 999는 추천 태그에 쓰이며 서로 다른 토큰임
  // [확인 필요] 2, 5, 10, 20, 24, 32, 40은 정의만 되어 있고 실제로 쓰인 곳이 확인되지 않음
  "radius": {
    "radius/4": 4,
    "radius/8": 8,
    "radius/12": 12,
    "radius/16": 16,
    "radius/20": 20,
    "radius/24": 24,
    "radius/32": 32,
    "radius/full": 9999,
    "radius/2": 2,
    "radius/0": 0,
    "radius/5": 5,
    "radius/6": 6,
    "radius/999": 999,
    "radius/10": 10,
    "radius/40": 40
  }
}
```
