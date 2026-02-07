import { cn } from "@/lib/utils";

export default function MatchBar({ score }: { score: number }) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(100, Math.max(0, score));

  return (
    <div className="w-28">
      <div className="h-2 rounded bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full transition-all",
            normalizedScore >= 80
              ? "bg-green-500"
              : normalizedScore >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
          )}
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
      <p className="text-xs mt-1 font-medium text-center">
        {normalizedScore}%
      </p>
    </div>
  );
}
