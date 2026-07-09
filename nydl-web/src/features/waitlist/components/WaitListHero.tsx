import { Badge } from "@/components/ui/badge";
import Countdown from "./Countdown";

export default function WaitlistHero() {
  return (
    <div className="space-y-6 text-center">
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4 py-1">
        🚀 Summer 2026 Cohort
      </Badge>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
        Learn. Build. Get Hired.
      </h1>
      <p className="text-slate-600 text-lg max-w-xl mx-auto">
        Become part of Ethiopia's next generation of software engineers.
      </p>
      <Countdown />
    </div>
  );
}