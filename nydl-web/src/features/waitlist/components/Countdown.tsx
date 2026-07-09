import { Card } from "@/components/ui/card";
import { useCountdown } from "../hooks/useCountdown";

const launchDate = new Date("2026-07-12T09:00:00");

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(launchDate);

  return (
    <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
      {[
        { label: "Days", value: days },
        { label: "Hours", value: hours },
        { label: "Minutes", value: minutes },
        { label: "Seconds", value: seconds },
      ].map((item) => (
        <Card key={item.label} className="py-6 text-center border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-slate-900">{item.value}</h2>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">
            {item.label}
          </p>
        </Card>
      ))}
    </div>
  );
}