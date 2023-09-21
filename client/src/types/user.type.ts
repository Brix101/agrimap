import {
  activeUserSchema,
  createUserSchema,
  roleSchema,
  userSchema,
} from "@/lib/validations/user";
import * as z from "zod";

export type User = z.infer<typeof userSchema>;
export type ActiveUser = z.infer<typeof activeUserSchema>;
export type Role = z.infer<typeof roleSchema>; // Define the FishEnum typ
export type CreateUserInput = z.infer<typeof createUserSchema>;
