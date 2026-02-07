type Props = {
  title: string;
  items: string[];
  type: "good" | "warn" | "info";
};

const styles = {
  good: "border-green-400 bg-green-50",
  warn: "border-yellow-400 bg-yellow-50",
  info: "border-blue-400 bg-blue-50",
};

export default function InsightCard({ title, items, type }: Props) {
  return (
    <div className={`border-l-4 p-6 rounded-xl ${styles[type]}`}>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
