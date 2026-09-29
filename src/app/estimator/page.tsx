import type { Metadata } from "next";
import Estimator from "@/components/tools/Estimator";
export const metadata: Metadata = {
  title: "Interior Cost Estimator",
  description:
    "Explore an indicative Mumbai interior budget, finish levels, add-ons and payment milestones.",
};
export const runtime = "nodejs";
export default function EstimatorPage() {
  return <Estimator />;
}
