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
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$mortgageTo", "$$userId"],
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
        let: { farmId: "$mortgagesIn.farm" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$farmId"] },
                  { $eq: ["$isArchive", false] },
                ],
              },
            },
          },
        ],
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
      $lookup: {
        from: "farms",
        let: { farmId: "$mortgagesOut.farm" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$_id", "$$farmId"] },
                  { $eq: ["$isArchive", false] },
                ],
              },
            },
          },
        ],
        as: "mortgagesOutfarms",
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
        ownedArea: { $sum: "$farms.size" },
        mortInSize: {
          $sum: "$morgageInfarms.size",
        },
        mortOutSize: {
          $sum: "$mortgagesOutfarms.size",
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
              $sum: "$mortgagesOutfarms.size",
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
