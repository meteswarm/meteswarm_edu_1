import { ButtonLink, Header, SaleChip, Tag } from "@/components/ui";
import { formatWon, plans } from "@/lib/plans";
import { FilterChips } from "./filter-chips";

export default function PlansPage() {
  return (
    <>
      <Header type="root" title="요금제" />
      <main className="flex flex-1 flex-col gap-4 bg-bg-default px-4 pt-4 pb-8">
        <section className="flex flex-col gap-1">
          <h2 className="text-heading-h3 text-text-primary">
            나에게 맞는 요금제를
            <br />
            골라보세요
          </h2>
          <p className="text-body-small-medium text-text-secondary">
            중요하게 보는 조건을 고르면 추천해 드려요
          </p>
        </section>

        <FilterChips />

        <p className="text-caption-medium text-text-tertiary">추천순 · {plans.length}개</p>

        <ul className="flex flex-col gap-3">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="flex flex-col gap-2 rounded-16 border border-border-default bg-bg-surface p-5"
            >
              {plan.recommended && <Tag>추천</Tag>}
              <h3 className="text-subtitle-bold text-text-primary">{plan.name}</h3>
              <p className="text-body-small-medium text-text-secondary">{plan.summary}</p>
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="flex items-baseline gap-2">
                    <span className="text-subtitle-bold text-text-accent">{plan.discountRate}%</span>
                    <span className="text-subtitle-bold text-text-primary">월 {formatWon(plan.price)}</span>
                  </p>
                  <p className="text-caption-medium text-text-tertiary line-through">
                    월 {formatWon(plan.originalPrice)}
                  </p>
                  <SaleChip>{plan.promotion}</SaleChip>
                </div>
                <ButtonLink href={`/plans/${plan.id}`} variant="secondary" size="sm">
                  자세히
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
