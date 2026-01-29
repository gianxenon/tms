import { z } from "zod";

export const userSchema = z.object({ 
  name: z.string(),
  userid: z.string(),
  avatar: z.string().nullable().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  email: z.string(),
  email_verified_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  department: z.string().nullable().optional(),
  position: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  token: z.string().optional(),
});
 
export type User = z.infer<typeof userSchema>
