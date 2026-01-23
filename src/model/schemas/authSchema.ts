import { z } from "zod";
import { userSchema } from "./userSchema"; 

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
