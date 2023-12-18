import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import DisbursementModel, {
  DisbursementInput,
  IDisbursement,
} from "../models/disbursement.model";

export async function getAllAssistances() {
  const result = await DisbursementModel.aggregate([
    {
      $project: {
        assistances: 1,
        _id: 0,
      },
    },
    {
      $unwind: "$assistances",
    },
    {
      $group: {
        _id: null,
        allAssistances: { $addToSet: "$assistances" },
      },
    },
    {
      $unwind: "$allAssistances",
    },
    {
      $sort: { allAssistances: 1 }, // Sort the assistances alphabetically
    },
    {
      $group: {
        _id: null,
        allAssistances: { $push: "$allAssistances" },
      },
    },
  ]);

  return result.length > 0 ? result[0].allAssistances : [];
}

export async function getAllDisbursement() {
  return DisbursementModel.find().populate("farmer").sort({ receivedDate: -1 });
}

export async function getAllDisbursementRange({
  from,
  to,
}: {
  from: Date;
  to: Date;
}) {
  const filter = {
    receivedDate: {
      $gte: from,
      $lte: to,
    },
  };
  return DisbursementModel.find(filter)
    .populate("farmer")
    .sort({ receivedDate: -1 });
}

export async function createDisbursement(input: DisbursementInput) {
  try {
    const disbursement = await DisbursementModel.create(input);
    await disbursement.populate("farmer");
    return disbursement.toJSON();
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findDisbursement(query: FilterQuery<IDisbursement>) {
  return await DisbursementModel.findOne(query).populate("farmer").lean();
}

export async function updateDisbursement(
  query: FilterQuery<IDisbursement>,
  update: UpdateQuery<IDisbursement>,
  options: QueryOptions
) {
  return DisbursementModel.findByIdAndUpdate(query, update, options);
}

export async function deleteDisbursement(query: FilterQuery<IDisbursement>) {
  return DisbursementModel.deleteOne(query);
}

export async function deleteDisbursements(query: FilterQuery<IDisbursement>) {
  return DisbursementModel.deleteMany(query);
}
