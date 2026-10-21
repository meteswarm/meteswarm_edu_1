import { Suspense } from "react";
import { Header } from "@/components/ui";
import { ApplyForm } from "./apply-form";

export default function ApplyPage() {
  return (
    <Suspense fallback={<Header type="default" title="변경 신청" backHref="/plans" />}>
      <ApplyForm />
    </Suspense>
  );
}
