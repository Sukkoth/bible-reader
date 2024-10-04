import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be atleast 6 charactors").max(20),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
