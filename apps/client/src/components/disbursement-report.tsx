import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetDisbursementReport } from "@/services/report.service";
import { subYears } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";

function DisbursementReport() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subYears(new Date(), 1),
    to: new Date(),
  });

  const { mutate, isLoading: isDownloadLoading } = useGetDisbursementReport();

  function handleSubmit() {
    setOpen(false);
    mutate(date);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild disabled={isDownloadLoading}>
          <Button
            size="sm"
            variant="secondary"
            disabled={isDownloadLoading}
            onClick={() => setOpen(true)}
          >
            {isDownloadLoading ? (
              <Icons.spinner className="h-6 w-6 animate-spin" />
            ) : (
              <Icons.fileDownload className="h-6 w-6" />
            )}
            <span className="pl-2">Download</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Download Disbursement Report</DialogTitle>
            <DialogDescription>
              Select a date range to download the disbursement report. Click
              download when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex justify-center">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.to}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DisbursementReport;
