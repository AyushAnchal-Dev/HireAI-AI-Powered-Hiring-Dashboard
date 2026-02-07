import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatsCards() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    applicants: 0,
    shortlisted: 0
  });

  useEffect(() => {
    fetch("/api/recruiter/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const statItems = [
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: Briefcase,
    },
    {
      title: "Applicants",
      value: stats.applicants,
      icon: Users,
    },
    {
      title: "In Progress",
      value: stats.shortlisted,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {statItems.map((stat) => (
        <Card className="transition-all hover:scale-105 hover:bg-white/15 bg-white/10 border-white/10 text-white backdrop-blur-md" key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stat.value}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Updated just now
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
