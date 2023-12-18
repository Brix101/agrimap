import { disbursementColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import DisbursementReport from "@/components/disbursement-report";
import { CreateDisbursemntForm } from "@/components/forms/disbursement-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import {
  disbursementsLoader,
  useGetDisbursements,
} from "@/services/disbursement.service";
import { useLoaderData } from "react-router-dom";

function DisbursementsPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof disbursementsLoader>>
  >;
  const { data, isLoading } = useGetDisbursements({ initialData });
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  function handleCreateClick() {
    setDialogItem({
      title: "Add Data",
      description: "add a disbursement data.",
      form: <CreateDisbursemntForm />,
    });
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Disbursements
          </PageHeaderHeading>

          <DisbursementReport />
          <Button size="sm" onClick={handleCreateClick}>
            Add disbursement
          </Button>
        </div>
        <PageHeaderDescription size="sm">
          Manage the disbursements
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-disbursements"
        aria-labelledby="dashboard-disbursements-heading"
      >
        <DataTable
          data={data ?? []}
          columns={disbursementColumns}
          searchPlaceHolder="Filter disbursement..."
          isLoading={isLoading}
        />
      </section>
    </Shell>
  );
}

export default DisbursementsPage;
