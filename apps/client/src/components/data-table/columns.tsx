import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  DisbursementDataTableRowActions,
  FarmDataTableRowActions,
  FarmerDataTableRowActions,
  MortgageDataTableRowActions,
  UserDataTableRowActions,
} from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Disbursement, Farm, Farmer, Mortgage, Role, User } from "schema";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("fullName")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Password" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("password")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.getValue<Role>("role");
      return (
        <div className="w-[50px] font-medium">
          <Badge variant={role === "ADMIN" ? "default" : "outline"}>
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserDataTableRowActions row={row} />,
  },
];

export const farmerColumns: ColumnDef<Farmer>[] = [
  {
    accessorKey: "rspc",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="RSPC" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize font-medium">
        {row.getValue("rspc")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("fullName")}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium text-center">
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "totalSize",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Owned Area (square meter)"
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {row.getValue<number>("totalSize")?.toFixed(2) ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "fullAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullAddress")}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <FarmerDataTableRowActions row={row} />,
  },
];

export const farmColumns: ColumnDef<Farm>[] = [
  {
    accessorKey: "titleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title Number" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("titleNumber")}</div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("ownerName")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (square meter)" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("size")}</div>
    ),
  },
  {
    // id: "isMortgageId",
    accessorKey: "isMortgage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mortgage Status" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {!row.getValue("isMortgage") ? "Not" : ""} Mortgage
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <FarmDataTableRowActions row={row} />,
  },
];

export const landStatusColumns: ColumnDef<Mortgage>[] = [
  {
    accessorKey: "farmTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title number" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmTitle")}
      </div>
    ),
  },
  {
    accessorKey: "mortgageToName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mortgage to" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("mortgageToName")}
      </div>
    ),
  },
  {
    accessorKey: "farmerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Land Owner" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmerName")}
      </div>
    ),
  },
  {
    accessorKey: "farmSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (square meter)" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmSize")}
      </div>
    ),
  },
  {
    accessorKey: "mortgageDateRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contract Duration" />
    ),
    cell: ({ row }) => (
      <div className="w-auto font-medium">
        {row.getValue("mortgageDateRange")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <MortgageDataTableRowActions row={row} />,
  },
];

export const disbursementColumns: ColumnDef<Disbursement>[] = [
  {
    accessorKey: "receiverName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Farmer Name" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("receiverName")}
      </div>
    ),
  },
  {
    accessorKey: "assistances",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assistance Name" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue<String[]>("assistances").join(", ")}
      </div>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (square meter)" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("size")}
      </div>
    ),
  },
  {
    accessorKey: "receivedDateFormat",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Received Date" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("receivedDateFormat")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DisbursementDataTableRowActions row={row} />,
  },
];
