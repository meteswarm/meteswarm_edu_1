"use client";

import { useState } from "react";
import { filters } from "@/lib/plans";

// 필터별 결과는 정해지지 않아(screens.md 전체 요금제 목록) 선택 표시만 바꾼다.
export function FilterChips() {
  const [selected, setSelected] = useState(filters[0]);

  return (
    <div role="radiogroup" aria-label="추천 조건" className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
      {filters.map((filter) => {
        const isSelected = filter === selected;
        return (
          <button
            key={filter}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setSelected(filter)}
            className={
              isSelected
                ? "h-10 shrink-0 rounded-full bg-fill-secondary px-4 py-2 text-body-small-strong text-text-on-dark"
                : "h-10 shrink-0 rounded-full border border-border-default bg-bg-surface px-4 py-2 text-body-small-medium text-text-primary"
            }
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
