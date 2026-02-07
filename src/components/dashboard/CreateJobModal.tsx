"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../../lib/job-schema";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type JobFormData = z.infer<typeof jobSchema>;

export default function CreateJobModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      description: "",
    },
  });

  async function onSubmit(data: JobFormData) {
    try {
      setLoading(true);
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create job");

      setOpen(false);
      form.reset();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to create job");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Create Job</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>Fill in the details below to post a new job.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            placeholder="Job Title"
            {...form.register("title")}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.title?.message}
          </p>

          <Input
            placeholder="Department"
            {...form.register("department")}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.department?.message}
          </p>

          <Textarea
            placeholder="Job Description"
            {...form.register("description")}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.description?.message}
          </p>

          <Input
            placeholder="Required Skills (comma separated, e.g. React, Node.js)"
            {...form.register("skills")}
          />
          <p className="text-sm text-red-500">
            {form.formState.errors.skills?.message}
          </p>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
