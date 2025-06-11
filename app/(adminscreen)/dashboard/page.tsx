import { AppSidebar } from "@/components/app-sidebar";
import ChartAreaInteractive from "@/components/chart-area-interactive";
import DataTable from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";
import { lazy, Suspense } from "react";

const ChartComponent = lazy(
  () => import("@/components/chart-area-interactive")
);
const DataTableComponent = lazy(() => import("@/components/data-table"));
export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <Suspense fallback={<div>Loading Chart...</div>}>
                <ChartComponent />
              </Suspense>
            </div>
            <Suspense fallback={<div>Loading Table...</div>}>
              <DataTableComponent data={data} />
            </Suspense>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
