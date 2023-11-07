import ExcelJS, { Cell } from "exceljs";
import { Request, Response } from "express";
import { getAllFarm } from "../services/farm.service";
import { getAllFarmer } from "../services/farmer.service";
import { getAllMortgage } from "../services/mortgage.service";
import { Farm, MortgageTo } from "../types";
import logger from "../utils/logger";

const getCurrentDateFormatted = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function applyCellStyles(cell: Cell) {
  cell.font = { bold: true, size: 14 }; // Bold text, font size 14
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "b8cce4" },
  };
  cell.alignment = { vertical: "middle", horizontal: "center" };
}

// Function to apply thick borders
function applyThickBorders(cell: Cell) {
  cell.border = {
    top: { style: "thick" },
    left: { style: "thick" },
    bottom: { style: "thick" },
    right: { style: "thick" },
  };
}

export const getReportHandler = async (req: Request, res: Response) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const farmerWorksheet = workbook.addWorksheet("Farmers");
    farmerWorksheet.getColumn("A").width = 23.43;
    farmerWorksheet.getColumn("B").width = 14.29;
    farmerWorksheet.getColumn("C").width = 14.29;
    farmerWorksheet.getColumn("D").width = 21.14;
    farmerWorksheet.getColumn("E").width = 76.14;

    const farmers = await getAllFarmer();
    farmerWorksheet.addRow([
      "RSPC",
      "Last Name",
      "First Name",
      "Phone Number",
      "Address",
    ]);

    const farmerHeader = farmerWorksheet.getRow(1);
    farmerHeader.eachCell((cell) => {
      applyCellStyles(cell);
      applyThickBorders(cell);
    });

    farmers.forEach((farmer) => {
      const { rspc, firstname, lastname, address, phoneNumber } = farmer;
      const fullAddress = `${address.streetAddress}, ${address.cityOrProvince}, ${address.municipality}, ${address.barangay}, ${address.zipcode}`;

      farmerWorksheet.addRow([
        rspc,
        lastname,
        firstname,
        phoneNumber,
        fullAddress,
      ]);
    });

    const farmWorksheet = workbook.addWorksheet("Farms");
    farmWorksheet.getColumn("A").width = 32;
    farmWorksheet.getColumn("B").width = 21.29;
    farmWorksheet.getColumn("C").width = 22.57;
    farmWorksheet.getColumn("D").width = 76.14;
    farmWorksheet.getColumn("E").width = 21.29;

    const farms = await getAllFarm();
    farmWorksheet.addRow([
      "Title Number",
      "Size (square meter)",
      "Owner",
      "Address",
      "Status",
    ]);
    const farmHeader = farmWorksheet.getRow(1);
    farmHeader.eachCell((cell) => {
      applyCellStyles(cell);
      applyThickBorders(cell);
    });

    // Add farm data to the farm worksheet
    farms.forEach((farm) => {
      const { owner, titleNumber, size, address, isMortgage } = farm;
      const ownerName = `${owner.lastname}, ${owner.firstname}`;
      const fullAddress = `${address.streetAddress}, ${address.cityOrProvince}, ${address.municipality}, ${address.barangay}, ${address.zipcode}`;
      const mortStatus = `${isMortgage ? "" : "Not "}Mortgage`;

      farmWorksheet.addRow([
        titleNumber,
        size,
        ownerName,
        fullAddress,
        mortStatus,
      ]);
    });

    const mortgageWorksheet = workbook.addWorksheet("Mortgages");
    mortgageWorksheet.getColumn("A").width = 31.29;
    mortgageWorksheet.getColumn("B").width = 21.29;
    mortgageWorksheet.getColumn("C").width = 21.86;
    mortgageWorksheet.getColumn("D").width = 23;
    mortgageWorksheet.getColumn("E").width = 76.14;

    const mortgages = await getAllMortgage();
    mortgageWorksheet.addRow([
      "Title Number",
      "Size (square meter)",
      "Owner",
      "Mortgage to",
      "Address",
    ]);
    const mortgageHeader = mortgageWorksheet.getRow(1);
    mortgageHeader.eachCell((cell) => {
      applyCellStyles(cell);
      applyThickBorders(cell);
    });

    // Add mortgage data to the mortgage worksheet
    mortgages.forEach((mortgage) => {
      const { farm, mortgageTo } = mortgage;
      const farmData = farm as unknown as Farm;
      const toData = mortgageTo as unknown as MortgageTo;

      const ownerName = `${farmData.owner.lastname}, ${farmData.owner.firstname}`;
      const mortgageToName = `${toData.lastname}, ${toData.firstname}`;
      const fullAddress = `${farmData.address.streetAddress}, ${farmData.address.cityOrProvince}, ${farmData.address.municipality}, ${farmData.address.barangay}, ${farmData.address.zipcode}`;

      mortgageWorksheet.addRow([
        farmData.titleNumber,
        farmData.size,
        ownerName,
        mortgageToName,
        fullAddress,
      ]);
    });

    // Generate the Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Set the response headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `Report-${getCurrentDateFormatted()}.xlsx`
    );

    res.send(buffer);
  } catch (error) {
    logger.error("Error generating Excel file:", error);
    res.status(500).send("Internal Server Error");
  }
};
