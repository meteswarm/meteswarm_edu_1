import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BottomCTA, ButtonLink, Header, ListRow, Tag } from "@/components/ui";
import { formatWon, getPlan, plans } from "@/lib/plans";

export function generateStaticParams() {
  return plans.map((plan) => ({ id: plan.id }));
}

export default function PlanDetailPage({ params }: PageProps<"/plans/[id]">) {
  return (
    <Suspense fallback={<Header type="default" title="요금제 상세" backHref="/plans" />}>
      <PlanDetail params={params} />
    </Suspense>
  );
}

async function PlanDetail({ params }: Pick<PageProps<"/plans/[id]">, "params">) {
  const { id } = await params;
  const plan = getPlan(id);
  if (!plan) notFound();

  return (
    <>
      <Header type="default" title="요금제 상세" backHref="/plans" />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-6">
        <section className="flex flex-col gap-2">
          {plan.recommended && <Tag>추천</Tag>}
          <h2 className="text-heading-h3 text-text-primary">{plan.name}</h2>
          {plan.tagline && (
            <p className="text-body-small-medium text-text-secondary">{plan.tagline}</p>
          )}
        </section>

        <section className="flex flex-col gap-1 rounded-12 bg-bg-default p-5">
          <p className="text-caption-medium text-text-tertiary">월 요금</p>
          <p className="flex items-baseline gap-1">
            <span className="text-heading-h2 text-text-primary">{formatWon(plan.price)}</span>
            <span className="text-subtitle-bold text-text-accent">{plan.discountRate}%</span>
          </p>
          <p className="text-caption-medium text-text-tertiary">
            <span className="line-through">{formatWon(plan.originalPrice)}/월</span> · {plan.promotion} 적용
          </p>
        </section>

        <section className="flex flex-col">
          <h3 className="mb-1 text-body-strong text-text-primary">기본 제공</h3>
          {plan.basics.map((row) => (
            <ListRow key={row.label} label={row.label} value={row.value} />
          ))}
        </section>

        {plan.benefits.length > 0 && (
          <section className="flex flex-col">
            <h3 className="mb-1 text-body-strong text-text-primary">포함 혜택</h3>
            {plan.benefits.map((benefit) => (
              <ListRow
                key={benefit}
                label={
                  <span className="flex items-center gap-3 text-body-small-strong text-text-primary">
                    <span className="size-1.5 rounded-full bg-fill-primary" aria-hidden="true" />
                    {benefit}
                  </span>
                }
                value={<span className="text-text-accent">포함</span>}
              />
            ))}
          </section>
        )}
      </main>

      <BottomCTA>
        <div className="flex items-center justify-between">
          <span className="text-body-small-medium text-text-secondary">월 납부 금액</span>
          <span className="text-subtitle-bold text-text-primary">월 {formatWon(plan.price)}</span>
        </div>
        <ButtonLink href={`/apply?plan=${plan.id}`}>변경 신청하기</ButtonLink>
      </BottomCTA>
    </>
  );
}
