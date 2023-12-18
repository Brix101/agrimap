import express, { Router } from "express";
import {
  getDisbursementReportHandler,
  getReportHandler,
} from "../controllers/report.controller";
import requiredUser from "../middlewares/requireUser";

const router: Router = express.Router();

router.get("/", requiredUser, getReportHandler);
router.get("/disbursement", requiredUser, getDisbursementReportHandler);

export default router;
