import { Card } from "@/components/ui/card";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <Card className="p-8 border-slate-100 shadow-none hover:shadow-lg transition-all duration-300 bg-white">
      <div className="mb-6 p-3 bg-blue-50 w-fit rounded-xl text-blue-600">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900">{title}</h3>
      <p className="text-slate-600 mt-2 leading-relaxed">{description}</p>
    </Card>
  );
}