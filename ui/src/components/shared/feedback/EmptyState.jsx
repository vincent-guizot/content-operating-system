import { FileText } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is nothing here yet.",
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 text-[#6b5b53]">
      <FileText className="w-12 h-12 mb-4 opacity-60" />

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
}
