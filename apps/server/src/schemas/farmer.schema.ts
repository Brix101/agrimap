import { createFarmerBody } from "schema";
import * as z from "zod";

export const addressSchema = z.object({
  streetAddress: z.string(),
  cityOrProvince: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  zipcode: z.string(),
});

const payload = {
  body: createFarmerBody,
};

const params = {
  params: z.object({
    farmerId: z.string({
      required_error: "farmerId is required",
    }),
  }),
};

const createFarmerSchema = z.object({ ...payload });
const updateFarmerSchema = z.object({
  ...payload,
  ...params,
});

const getFarmerSchema = z.object({ ...params });

export { createFarmerSchema, getFarmerSchema, updateFarmerSchema };