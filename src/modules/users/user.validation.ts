import { z } from "zod";
import { UserRole } from "../../shared/types";

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole),
  }),
  params: z.object({
    id: z.coerce.number({
      invalid_type_error: "ID must be a valid number",
    }),
  }),
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      invalid_type_error: "ID must be a valid number",
    }),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>["body"];
