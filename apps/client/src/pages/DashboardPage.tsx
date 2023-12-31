import { Icons } from "@/components/icons";
import { MemoizedOverview } from "@/components/overview";
import OverviewSwitcher from "@/components/overview-switcher";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { MemoizedRecentAddedFarmer } from "@/components/recent-added-farmer";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoundStore } from "@/lib/store";
import { useGetExcelReport } from "@/services/report.service";
import {
  useGetRecentAdded,
  useGetStatCount,
  useGetStatistics,
} from "@/services/statistic.service";

function DashboardPage() {
  const { activeSwitcher } = useBoundStore((state) => state.overview);

  const { data: recentData, isLoading: isRecentLoading } = useGetRecentAdded();

  const { data: statData, isLoading: isStatsLoading } = useGetStatistics({
    query: {
      by: activeSwitcher.value,
    },
  });

  const { data: countData, isLoading: isCountLoading } = useGetStatCount();

  const { mutate, isLoading: isDownloadLoading } = useGetExcelReport();

  const totalMortgageSize = countData?.totalMortgageSize ?? 0;
  const totalFarmSize = countData?.totalFarmSize ?? 0;
  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex items-center justify-between space-y-2">
          <PageHeaderHeading size="sm" className="flex-1">
            Dashboard
          </PageHeaderHeading>
          <div className="flex items-center space-x-2">
            <OverviewSwitcher isLoading={isStatsLoading} />
            <Button onClick={() => mutate()} disabled={isDownloadLoading}>
              {isDownloadLoading ? (
                <Icons.spinner className="h-6 w-6 animate-spin" />
              ) : (
                <Icons.fileDownload className="h-6 w-6" />
              )}
              Download
            </Button>
          </div>
        </div>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCountLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <div className="text-2xl font-bold">
                  {countData?.totalFarmers}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Farm Size (square meter)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCountLoading ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <div className="text-2xl font-bold">
                  {countData?.totalFarmSize}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mortgage farm size (square meter)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isCountLoading ? (
                <div className="space-y-1">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {countData?.totalMortgageSize}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {parseFloat(
                      ((totalMortgageSize / totalFarmSize) * 100).toString(),
                    ).toFixed(2)}{" "}
                    % of Total farm size
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <MemoizedOverview isLoading={isStatsLoading} data={statData} />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Added</CardTitle>
              <CardDescription>
                {recentData?.count ?? 0} farmer added this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRecentLoading ? (
                <>Loading...</>
              ) : (
                <MemoizedRecentAddedFarmer farmers={recentData?.todayFarmers} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Shell>
  );
}

// <MapContainer />
export default DashboardPage;
