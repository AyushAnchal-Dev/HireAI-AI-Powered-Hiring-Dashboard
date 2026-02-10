"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Resume Matching",
    description: "Automatically score resumes based on job requirements."
  },
  {
    title: "Recruiter Dashboard",
    description: "Track applicants, shortlist candidates, and manage jobs."
  },
  {
    title: "Modern UI",
    description: "Clean, fast, and responsive SaaS interface."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >

          {features.map((item, i) => (
            <Card className="transition hover:shadow-lg hover:-translate-y-1" key={i}>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
