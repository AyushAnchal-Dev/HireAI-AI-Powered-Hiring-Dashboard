import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Job title is required"),
  department: z.string().min(2, "Department is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.string().min(3, "Please list at least one skill"),
});
