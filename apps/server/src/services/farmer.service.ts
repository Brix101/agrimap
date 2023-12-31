import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import FarmerModel, { FarmerInput, IFarmer } from "../models/farmer.model";

export async function getAllFarmer() {
  return FarmerModel.aggregate([
    {
      $lookup: {
        from: "farms",
        let: { farmerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$owner", "$$farmerId"] },
                  { $eq: ["$isArchived", false] },
                ],
              },
            },
          },
        ],
        as: "farms",
      },
    },
    {
      $lookup: {
        from: "mortgages",
        let: { farmerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$mortgageTo", "$$farmerId"],
                  },
                  { $eq: ["$status", "Active"] },
                ],
              },
            },
          },
        ],
        as: "mortgagesIn",
      },
    },
    {
      $lookup: {
        from: "farms",
        localField: "mortgagesIn.farm",
        foreignField: "_id",
        as: "morgageInfarms",
      },
    },
    {
      $lookup: {
        from: "mortgages",
        localField: "farms._id",
        foreignField: "farm",
        as: "mortgagesOut",
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        rspc: 1,
        firstname: 1,
        lastname: 1,
        middleInitial: 1,
        address: 1,
        phoneNumber: 1,
        createdAt: 1,
        updatedAt: 1,
        mortgagesOut: 1,
        mortgagesOutfarms: 1,
        ownedArea: { $sum: "$farms.size" },
        mortInSize: {
          $sum: "$morgageInfarms.size",
        },
        mortOutSize: {
          $sum: "$mortgagesOut.size",
        },
        totalSize: {
          $subtract: [
            {
              $add: [
                { $sum: "$farms.size" },
                {
                  $sum: "$morgageInfarms.size",
                },
              ],
            },
            {
              $sum: "$mortgagesOut.size",
            },
          ],
        },
      },
    },
  ]);
}

export async function createFarmer(input: FarmerInput) {
  try {
    const farmer = await FarmerModel.create(input);

    return farmer.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findFarmer(query: FilterQuery<IFarmer>) {
  return FarmerModel.findOne(query).lean();
}

export async function updateFarmer(
  query: FilterQuery<IFarmer>,
  update: UpdateQuery<IFarmer>,
  options: QueryOptions
) {
  return FarmerModel.findByIdAndUpdate(query, update, options);
}

export async function deleteFarmer(query: FilterQuery<IFarmer>) {
  return FarmerModel.deleteOne(query);
}
