import { Construction } from "lucide-react";

export function TabStub({ title }: { title: string }) {
  return (
    <div className="card-panel p-10 text-center">
      <Construction size={28} className="mx-auto text-pitch-500 mb-3" />
      <div className="text-sm font-semibold text-pitch-200">{title}</div>
      <div className="text-xs text-pitch-500 mt-1">
        Coming next — for now use the Overview tab for xG and statistics.
      </div>
    </div>
  );
}
