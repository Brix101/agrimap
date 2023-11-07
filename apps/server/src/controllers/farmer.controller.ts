import { Request, Response } from "express";
import { deleteFarms } from "../services/farm.service";
import {
  createFarmer,
  deleteFarmer,
  findFarmer,
  getAllFarmer,
  updateFarmer,
} from "../services/farmer.service";
import { deleteMortgages } from "../services/mortgage.service";
import {
  CreateFarmerInput,
  GetFarmerInput,
  UpdateFarmerInput,
} from "../types/farmer.types";
import logger from "../utils/logger";

const getAllFarmerHandler = async (req: Request, res: Response) => {
  const farmers = await getAllFarmer();
  return res.send(farmers);
};

const getFarmerHandler = async (
  req: Request<GetFarmerInput["params"]>,
  res: Response
) => {
  try {
    const farmerId = req.params.farmerId;

    const farmer = await findFarmer({ _id: farmerId });

    if (!farmer) {
      return res.sendStatus(404);
    }

    return res.send(farmer);
  } catch (error: any) {
    logger.error(error);
    return res.status(404).send(error.message);
  }
};

const createFarmerHandler = async (
  req: Request<{}, {}, CreateFarmerInput["body"]>,
  res: Response
) => {
  try {
    const body = req.body;

    const farmer = await createFarmer({
      ...body,
    });

    return res.send(farmer);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const updateFarmerHandler = async (
  req: Request<UpdateFarmerInput["params"]>,
  res: Response
) => {
  const farmerId = req.params?.farmerId ?? "";
  const update = req.body;

  const farmer = await findFarmer({ _id: farmerId });

  if (!farmer) {
    return res.sendStatus(404);
  }

  try {
    const updatedFarmer = await updateFarmer({ _id: farmerId }, update, {
      new: true,
    });

    return res.send(updatedFarmer);
  } catch (error: any) {
    logger.error(error);
    return res.status(409).send(error.message);
  }
};

const deleteFarmerHandler = async (
  req: Request<GetFarmerInput["params"]>,
  res: Response
) => {
  const farmerId = req.params.farmerId;
  const farmer = await findFarmer({ _id: farmerId });

  if (!farmer) {
    return res.sendStatus(404);
  }

  try {
    await deleteFarmer({ _id: farmerId });
    await deleteFarms({ owner: farmerId });
    await deleteMortgages({ mortgageTo: farmerId });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(409).send(error.message);
  }
};

export {
  createFarmerHandler,
  deleteFarmerHandler,
  getAllFarmerHandler,
  getFarmerHandler,
  updateFarmerHandler,
};
