import * as z from "zod";

export const addressSchema = z.object({
  streetAddress: z.string(),
  cityOrProvince: z.string(),
  municipality: z.string(),
  barangay: z.string(),
  zipcode: z.string(),
});

export const farmerSchema = z
  .object({
    _id: z.string(),
    rspc: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    middleInitial: z.string(),
    address: addressSchema,
    phoneNumber: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    totalSize: z.number().nullish(),
    fullName: z.string().nullish(),
    fullAddress: z.string().nullish(),
  })
  .transform((obj) => ({
    ...obj,
    fullName: `${obj.lastname}, ${obj.firstname} ${obj.middleInitial}.`,
    fullAddress: `${obj.address.streetAddress}, ${obj.address.barangay}, ${obj.address.municipality}, ${obj.address.cityOrProvince}, ${obj.address.zipcode}`,
  }));

export const farmersSchema = z.object({
  farmers: z.array(farmerSchema),
});

const phoneRegex = new RegExp(/^([+]?[\s0-9]+)?(\d{11})$/);

export const createFarmerBody = z.object({
  firstname: z.string().min(1, { message: "Please input a firstname" }),
  lastname: z.string().min(1, { message: "Please input a lastname" }),
  middleInitial: z
    .string()
    .min(1, { message: "Required" })
    .max(1, { message: "Max 1" }),
  address: addressSchema,
  phoneNumber: z.string().regex(phoneRegex, "Invalid Number!"),
});

export type Address = z.infer<typeof addressSchema>;
export type Farmer = z.infer<typeof farmerSchema>;
export type Farmers = z.infer<typeof farmersSchema>;
export type CreateFarmerInput = z.infer<typeof createFarmerBody>;
